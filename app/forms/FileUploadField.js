import React, { PropTypes, Component } from 'react';
import Dropzone from 'react-dropzone';
import { FormattedMessage } from 'react-intl';

import debug from 'debug';
import without from 'lodash/without';
import union from 'lodash/union';

import Tooltip from '../widgets/Tooltip';
import Icon from '../widgets/Icon';
import request from '../utils/request';
import { s3Buckets } from '../config';
import { getVariation } from '../utils/APIUtils';
import { getFilename } from '../utils/StringUtils';

const log = debug('shoutit:ui:FileUploadField');

import '../forms/FileUploadField.scss';

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
        <span className="FileUploadField-file-trash" onClick={ () => onDeleteClick(upload) } >
          <Icon name="trash" fill />
        </span>
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
    disabled: PropTypes.bool,
    accept: PropTypes.string,
    initialFileUrls: PropTypes.array,
    label: PropTypes.string,
    max: PropTypes.number,
    onChange: PropTypes.func,
    onUploadEnd: PropTypes.func,
    onUploadStart: PropTypes.func,
    uploadingLabel: PropTypes.string,
  }

  static defaultProps = {
    label: 'Upload files',
    max: 10,
    initialFileUrls: [],
    accept: 'image/png,image/jpeg',
  }

  constructor(props) {
    super(props);
    this.upload = this.upload.bind(this);
    this.delete = this.delete.bind(this);
    this.open = this.open.bind(this);
    this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.state = {
      uploads: props.initialFileUrls.map(url => ({ url })),
      filesToDelete: [],
      dragging: false,
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

  getRemainingFiles() {
    return this.props.max - this.state.uploads.length;
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

  open() {
    this.refs.dropzone.open();
  }

  delete(upload) {
    const { resourceType, initialFileUrls, onUploadEnd } = this.props;

    log('Deleting upload', upload);
    this.setState({
      uploads: without(this.state.uploads, upload),
    }, () => {

      if (this.props.onChange) {
        this.props.onChange(this.getValue());
      }

      if (upload.request) {
        log('Aborting running request...');
        upload.request.abort();
        if (!this.isUploading() && onUploadEnd) {
          onUploadEnd();
        }
        return;
      }

      const name = getFilename(upload.url);

      if (initialFileUrls.includes(upload.url)) {
        log('Setting %s for deletion', name);
        this.setState({
          filesToDelete: union(this.state.filesToDelete, [name]),
        });
        return;
      }

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
    });

  }

  upload(files) {
    const { resourceType, onUploadStart, onUploadEnd } = this.props;
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
        .attach(s3Buckets[resourceType].fieldname, file)
        .on('progress', e => {
          const uploads = [...this.state.uploads];
          if (uploads[index]) {
            uploads[index].percent = e.percent;
          }
          this.setState({ uploads });
        })
        .end((err, res) => {
          const uploads = [...this.state.uploads];

          if (uploads[index]) {
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
          }

          this.setState({ uploads });

          if (this.props.onChange) {
            this.props.onChange(this.getValue());
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

  handleDragEnter() {
    if (this.getRemainingFiles() > 0) {
      this.setState({ dragging: true });
    }
  }

  handleDragLeave() {
    this.setState({ dragging: false });
  }

  handleDrop(files) {
    this.setState({ dragging: false });
    files = files.slice(0, this.getRemainingFiles());
    if (files.length === 0) {
      log('Ignore drop, max number of files reached.');
      return;
    }
    this.upload(files);
  }

  render() {
    const { max } = this.props;
    let className = 'FileUploadField FormField';
    if (this.state.dragging) {
      className += ' dragging';
    }
    if (this.props.disabled) {
      className += ' disabled';
    }
    if (this.state.uploads.length === 0) {
      className += ' no-files';
    }
    return (
      <div className={ className }>
        <Dropzone
          accept={ this.props.accept }
          disableClick
          onDrop={ this.handleDrop }
          onDragEnter={ this.handleDragEnter }
          onDragLeave={ this.handleDragLeave }
          className="FileUploadField-dropzone"
          activeClassName="FileUploadField-dropzone active"
          ref="dropzone">
          <div className="FileUploadField-instructions">
            <FormattedMessage
              id="ui.fileUpload.instructions"
              defaultMessage="To upload files, click on {icon} or drop them here"
              values={ { icon: <Icon name="camera" size="small" hover onClick={ this.open } /> } }
            />
          </div>

          { this.state.uploads.map((upload, i) =>
            <File key={ i } upload={ upload } onDeleteClick={ this.delete } />
          ) }

          { this.state.uploads.length < max &&
            <div className="FileUploadField-add" ref="dropzone" onClick={ this.open } />
          }

        </Dropzone>
      </div>
    );
  }
}
