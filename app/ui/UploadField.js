import React, { PropTypes, Component } from 'react';
import Dropzone from 'react-dropzone';
import FormField from './FormField';
import Icon from './Icon';
import request from '../utils/request';
import { uploadResources } from '../config';
import { getVariation } from '../utils/APIUtils';

if (process.env.BROWSER) {
  require('./UploadField.scss');
}

export function File({ upload, onDeleteClick }) {
  const url = upload.file ? upload.file.preview : getVariation(upload.url, 'small');

  return (
    <span
      className="UploadField-file"
      style={{ backgroundImage: `url("${url}")` }}>

      { upload.percent < 100 &&
        <div className="UploadField-file-percent" style={{ width: `${100 - upload.percent}%` }} />
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
    label: PropTypes.string,
    onChange: PropTypes.func,
    maxFiles: PropTypes.number,
    resourceType: PropTypes.oneOf(['shout', 'user', 'tag']),
    urls: PropTypes.array,
  }

  static defaultProps = {
    label: 'Upload files',
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

  getValue() {
    return this.state.uploads.filter(upload => !!upload.url).map(upload => upload.url);
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
    const { resourceType, onChange } = this.props;
    const uploads = [];

    const existingUploads = this.state.uploads;
    files.forEach((file) => {
      uploads.push({
        file,
        percent: 0,
      });
      const index = existingUploads.length + uploads.length - 1;
      request
       .post(`/api/file/${resourceType}`)
       .attach(uploadResources[resourceType].fieldname, file)
       .on('progress', function handleProgress(e) { // eslint-disable-line
         this.state.uploads[index].percent = e.percent;
         this.setState({
           uploads: this.state.uploads,
         });
       }.bind(this))
       .end(function handleResponse(err, res) { // eslint-disable-line
         if (err || !res.ok) {
           this.state.uploads[index].error = err;
         } else {
           delete this.state.uploads[index].request;
           this.state.uploads[index].ok = true;
           this.state.uploads[index].url = res.text;
           this.state.uploads[index].fileName = res.text.split('/')[res.text.split('/').length - 1];
         }
         this.setState({
           uploads: this.state.uploads,
         });
         if (onChange) {
           onChange(this.getValue());
         }
       }.bind(this));


    });

    this.setState({ uploads: [...this.state.uploads, ...uploads] });
  }

  render() {
    const { label, maxFiles } = this.props;
    const { uploads } = this.state;
    return (
      <div className="UploadField" style={{ position: 'relative' }}>
        <Dropzone accept="image/x-png, image/jpeg" disableClick onDrop={ this.upload } className="UploadField-dropzone" ref="dropzone">
        <FormField block inset label={ label }>
          { uploads.map((upload, i) => <File key={ i } upload={ upload } onDeleteClick={ this.delete } />) }
          { uploads.length < maxFiles && <div className="UploadField-add" ref="dropzone" onClick={ () => this.refs.dropzone.open() }></div> }
        </FormField>
        </Dropzone>
      </div>
    );
  }
}