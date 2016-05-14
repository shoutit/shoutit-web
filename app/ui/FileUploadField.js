import React, { PropTypes, Component } from 'react';
import Dropzone from 'react-dropzone';
import debug from 'debug';
import without from 'lodash/without';
import union from 'lodash/union';

import Tooltip from '../ui/Tooltip';
import FormField from '../ui/FormField';
import Icon from '../ui/Icon';
import request from '../utils/request';
import { uploadResources } from '../config';
import { getVariation } from '../utils/APIUtils';
import { getFilename } from '../utils/StringUtils';

const log = debug('shoutit:ui:FileUploadField');

if (process.env.BROWSER) {
  require('../ui/FileUploadField.scss');
}

export function File({ upload, onDeleteClick }) {
  const url = upload.file ? upload.file.preview : getVariation(upload.url, 'small');

  let percent = 100;
  if (upload.isUploading) {
    percent = upload.percent * 0.75;
  }

  return (
    <span
      className="FileUploadField-file"
      style={ { backgroundImage: `url("${url}")` } }>

      <div className="FileUploadField-file-percent" style={ { width: `${100 - percent}%` } } />

      { upload.error && <div className="FileUploadField-file-error" /> }

      <Tooltip overlay="Click to delete">
        <div className="FileUploadField-file-trash" onClick={ () => onDeleteClick(upload) } >
          <Icon name="trash" fill />
        </div>
      </Tooltip>

    </span>
  );
}

File.propTypes = {
  upload: PropTypes.object.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

export default class FileUploadField extends Component {

  static propTypes = {
    resourceType: PropTypes.oneOf(['shout', 'user', 'tag']).isRequired,
    name: PropTypes.string.isRequired,
    deleteTooltip: PropTypes.string,
    disabled: PropTypes.bool,
    initialFileUrls: PropTypes.array, // existing files to delete
    label: PropTypes.string,
    maxFiles: PropTypes.number,
    onChange: PropTypes.func,
    onUploadEnd: PropTypes.func,
    onUploadStart: PropTypes.func,
    uploadingLabel: PropTypes.string,
  }

  static defaultProps = {
    label: 'Upload files',
    deleteTooltip: 'Click to remove',
    uploadingLabel: 'Uploading…',
    maxFiles: 18,
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

    const name = getFilename(upload.url);

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
        .on('progress', e => {
          const uploads = [...this.state.uploads];
          uploads[index].percent = e.percent;
          this.setState({ uploads });
        })
        .end((err, res) => {
          const uploads = [...this.state.uploads];
          uploads[index].isUploading = false;

          if (err || !res.ok) {
            uploads[index].error = err;
            console.error(err); // eslint-disable-line
          } else {
            delete uploads[index].request;
            uploads[index].ok = true;
            uploads[index].url = res.text;
            uploads[index].fileName = getFilename(res.text);
          }

          log('Finished uploading %s of %s', i + 1, files.length, this.state.uploads[index].fileName);

          this.setState({ uploads });

          if (onChange) {
            onChange(this.getValue());
          }

          if (onUploadEnd && !this.isUploading()) {
            log('All uploads did finish, fire onUploadEnd');
            onUploadEnd();
          }

        });
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
      <div className="FileUploadField" style={ { position: 'relative' } }>
        <FormField label={ this.isUploading() ? uploadingLabel : label } name={ name }>
          <Dropzone accept="image/x-png, image/jpeg" disableClick onDrop={ this.upload } className="FileUploadField-dropzone" activeClassName="FileUploadField-dropzone active" ref="dropzone">
            <div className="FileUploadField-instructions">
              Click on <Icon name="add" size="small" onClick={ () => this.refs.dropzone.open() } /> or drop images here.
            </div>

            { uploads.map((upload, i) => <File key={ i } upload={ upload } onDeleteClick={ this.delete } />) }
            { uploads.length < maxFiles &&
              <div className="FileUploadField-add" ref="dropzone" onClick={ () => this.refs.dropzone.open() }></div> }
          </Dropzone>
        </FormField>
      </div>
    );
  }
}
