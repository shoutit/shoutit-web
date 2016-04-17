import React, { PropTypes, Component } from 'react';
import Dropzone from 'react-dropzone';
import debug from 'debug';
import without from 'lodash/array/without';
import last from 'lodash/array/last';
import union from 'lodash/array/union';

import FormField from './FormField';
import Icon from './Icon';
import request from '../utils/request';
import { uploadResources } from '../config';
import { getVariation } from '../utils/APIUtils';

const log = debug('shoutit:ui:UploadField');

if (process.env.BROWSER) {
  require('./UploadField.scss');
}

export function File({ upload, onDeleteClick }) {
  const url = upload.file ? upload.file.preview : getVariation(upload.url, 'small');

  let percent = 100;
  if (upload.isUploading) {
    percent = upload.percent * 0.75;
  }

  return (
    <span
      className="UploadField-file"
      style={{ backgroundImage: `url("${url}")` }}>

      { percent < 100 &&
        <div className="UploadField-file-percent" style={{ width: `${100 - percent}%` }} />
      }

      { upload.error && <div className="UploadField-file-error" /> }

      <div className="UploadField-file-trash">
        <Icon onClick={ () => onDeleteClick(upload) } name="trash" fill />
      </div>


    </span>
  );
}

File.propTypes = {
  upload: PropTypes.object.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

export default class UploadField extends Component {

  static propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    uploadingLabel: PropTypes.string,
    onChange: PropTypes.func,
    onUploadStart: PropTypes.func,
    onUploadEnd: PropTypes.func,
    maxFiles: PropTypes.number,
    resourceType: PropTypes.oneOf(['shout', 'user', 'tag']).isRequired,
    initialFileUrls: PropTypes.array, // existing files to delete
  }

  static defaultProps = {
    label: 'Upload files',
    uploadingLabel: 'Uploading…',
    maxFiles: 5,
    initialFileUrls: [],
  }

  constructor(props) {
    super(props);
    this.upload = this.upload.bind(this);
    this.delete = this.delete.bind(this);
    this.state = {
      uploads: props.initialFileUrls.map(url => ({ url })),
      filesToDelete: [],
    };
  }

  componentWillUnmount() {
    this.abortUnfinishedUploads();
  }

  getValue() {
    return this.state.uploads.filter(upload => !!upload.url).map(upload => upload.url);
  }

  getFilesToDelete() {
    return this.state.filesToDelete;
  }

  isUploading() {
    return this.state.uploads.some(upload => upload.isUploading);
  }

  abortUnfinishedUploads() {
    log('Aborting unfinished uploads...');
    this.state.uploads
      .forEach(upload => {
        if (upload.request) {
          upload.request.abort();
        }
      });
  }

  delete(upload) {
    const { resourceType, initialFileUrls, onUploadEnd } = this.props;

    if (upload.request) {
      const wasUploading = this.isUploading();
      log('Aborting running request...');
      upload.request.abort();
      this.setState({
        uploads: without(this.state.uploads, upload),
      }, () => {
        if (wasUploading && !this.isUploading() && onUploadEnd) {
          onUploadEnd();
        }
      });

      return;
    }

    const name = last(upload.url.split('/'));

    if (initialFileUrls.includes(upload.url)) {
      log('Setting %s for deletion', name);
      this.setState({
        filesToDelete: union(this.state.filesToDelete, [name]),
        uploads: without(this.state.uploads, upload),
      });
      return;
    }
    this.setState({
      uploads: without(this.state.uploads, upload),
    });
    log('Deleting %s...', name);
    request
      .delete(`/api/file/${resourceType}`)
      .query({ name })
      .end(function handleResponse(err, res) { // eslint-disable-line
        if (err || !res.ok) {
          console.error(err); // eslint-disable-line
          return;
        }
        log('Deleted %s', name);
      }.bind(this)); // eslint-disable-line
  }

  upload(files) {
    const { resourceType, onChange, onUploadStart, onUploadEnd } = this.props;
    const uploads = [];
    const existingUploads = this.state.uploads;

    log('Uploading %s file(s)...', files.length);

    files.forEach((file, i) => {
      uploads.push({
        file,
        percent: 0,
        isUploading: true,
      });
      const index = existingUploads.length + uploads.length - 1;

      uploads[uploads.length - 1].request = request
       .post(`/api/file/${resourceType}`)
       .attach(uploadResources[resourceType].fieldname, file)
       .on('progress', function handleProgress(e) { // eslint-disable-line
         this.state.uploads[index].percent = e.percent;
         this.setState({
           uploads: this.state.uploads,
         });
        }.bind(this)) // eslint-disable-line
        .end(function handleResponse(err, res) { // eslint-disable-line

          this.state.uploads[index].isUploading = false;

          if (err || !res.ok) {
            this.state.uploads[index].error = err;
            console.error(err); // eslint-disable-line
          } else {
            delete this.state.uploads[index].request;
            this.state.uploads[index].ok = true;
            this.state.uploads[index].url = res.text;
            this.state.uploads[index].fileName = last(res.text.split('/'));
          }

          log('Finished uploading %s of %s', i + 1, files.length, this.state.uploads[index].fileName);

          this.setState({
            uploads: this.state.uploads,
          });

          if (onChange) {
            onChange(this.getValue());
          }

          if (onUploadEnd && !this.isUploading()) {
            log('All uploads did finish, fire onUploadEnd');
            onUploadEnd();
          }

       }.bind(this)); // eslint-disable-line
    });

    if (onUploadStart) {
      onUploadStart();
    }

    this.setState({ uploads: [...this.state.uploads, ...uploads] });
  }

  render() {
    const { label, uploadingLabel, maxFiles, name } = this.props;
    const { uploads } = this.state;

    return (
      <div className="UploadField" style={{ position: 'relative' }}>
        <Dropzone accept="image/x-png, image/jpeg" disableClick onDrop={ this.upload } className="UploadField-dropzone" ref="dropzone">
        <FormField block inset label={ this.isUploading() ? uploadingLabel : label } name={ name }>
          { uploads.map((upload, i) => <File key={ i } upload={ upload } onDeleteClick={ this.delete } />) }
          { uploads.length < maxFiles && <div className="UploadField-add" ref="dropzone" onClick={ () => this.refs.dropzone.open() }></div> }
        </FormField>
        </Dropzone>
      </div>
    );
  }
}
