import React, { PropTypes, Component } from 'react';
import Dropzone from 'react-dropzone';
import debug from 'debug';

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

      <div className="UploadField-file-trash">
        <Icon onClick={ () => onDeleteClick(upload) } name="trash" fill />
      </div>

      { upload.error && <div className="UploadField-file-error" /> }

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
    urls: PropTypes.array, // existing files to delete
  }

  static defaultProps = {
    label: 'Upload files',
    uploadingLabel: 'Uploading…',
    maxFiles: 5,
    urls: [],
  }

  constructor(props) {
    super(props);
    this.upload = this.upload.bind(this);
    this.delete = this.delete.bind(this);
    this.state = {
      requests: [],
      uploads: props.urls.map(url => ({ url })),
    };
  }

  componentWillUnmount() {
    this.abortUnfinishedUploads();
  }

  getValue() {
    return this.state.uploads.filter(upload => !!upload.url).map(upload => upload.url);
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
    const { resourceType } = this.props;

    if (upload.request) {
      upload.request.abort();
    } else {
      request
       .delete(`/api/file/${resourceType}`)
       .query({ name: upload.fileName })
       .end(function handleResponse(err, res) { // eslint-disable-line
        //  console.log(res);
          //  if (err || !res.ok) {
          //    this.state.uploads[index].error = err;
          //  } else {
          //    this.state.uploads[index].ok = true;
          //    this.state.uploads[index].url = res.text;
          //  }
          //  this.setState({
          //    uploads: this.state.uploads,
          //  });
       }.bind(this));
    }
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
        }.bind(this))
        .end(function handleResponse(err, res) { // eslint-disable-line

          this.state.uploads[index].isUploading = false;

          if (err || !res.ok) {
            this.state.uploads[index].error = err;
            console.error(err); // eslint-disable-line
          } else {
            delete this.state.uploads[index].request;
            this.state.uploads[index].ok = true;
            this.state.uploads[index].url = res.text;
            this.state.uploads[index].fileName = res.text.split('/')[res.text.split('/').length - 1];
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

       }.bind(this));


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
