import React, { PropTypes, Component } from 'react';
import FileUploadField from '../ui/FileUploadField';
import Form from '../ui/Form';
import Button from '../ui/Button';
import Modal, { Header, Footer, Body } from '../ui/Modal';

export default class ImageUploadModal extends Component {

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    openOnMount: PropTypes.bool,
    max: PropTypes.number,
    initialImages: PropTypes.array,
  }

  static defaultProps = {
    submitLabel: 'Upload',
    openOnMount: false,
    max: 5,
    initialImages: [],
  }

  constructor(props) {
    super(props);
    this.hide = this.hide.bind(this);
    this.submit = this.submit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleUploadStart = this.handleUploadStart.bind(this);
    this.handleUploadEnd = this.handleUploadEnd.bind(this);
  }

  state = {
    isUploading: false,
    images: [],
  }

  componentDidMount() {
    if (this.props.initialImages.length > 0) {

      const files = [...this.props.initialImages];

      const promises = [];
      files.forEach(file => {
        if (file.preview) {
          return;
        }
        promises.push(new Promise(resolve => {
          const reader = new FileReader();
          reader.onload = e => {
            file.preview = e.target.result;
            resolve();
          };
          reader.readAsDataURL(file);
        }));
      });

      Promise.all(promises).then(() => {
        this.fileUploadField.handleDrop(this.props.initialImages);
      });

    }
  }

  fileUploadField = null

  handleChange(files) {
    this.setState(files);
  }

  handleUploadStart() {
    this.setState({ isUploading: true });
  }

  handleUploadEnd() {
    this.setState({ isUploading: false });
  }

  submit() {
    this.hide();
    this.props.onSubmit(this.fileUploadField.getValue());
  }

  hide() {
    this.refs.modal.hide();
  }

  render() {

    let submitLabel = 'Send images';

    if (this.state.isUploading) {
      submitLabel = 'Uploading...';
    } else if (this.state.images.length === 1) {
      submitLabel = 'Send image';
    } else if (this.state.images.length > 1) {
      submitLabel = `Send ${this.state.images.length} images`;
    }

    return (
      <Modal {...this.props} ref="modal" size="x-small">
        <Header closeButton>
          Upload images
        </Header>
        <Body>
          <Form onSubmit={ this.submit }>
            <FileUploadField
              ref={ el => { this.fileUploadField = el; } }
              name="images"
              resourceType="shout"
              label={ 'Upload images' }
              disabled={ false }
              onChange={ images => this.handleChange({ images }) }
              onUploadStart={ this.handleUploadStart }
              onUploadEnd={ this.handleUploadEnd }
              error={ null }
              accept="image/x-png, image/jpeg"
              max={ this.props.max }
            />
          </Form>
        </Body>
        <Footer>
          <span style={ { marginRight: '.5rem' } }>
            <Button size="small" key="cancel" type="button" onClick={ this.hide }>
              Cancel
            </Button>
          </span>
          <Button onClick={ this.submit } size="small" key="submit" action="primary" disabled={ this.state.isUploading || this.state.images.length === 0 }>
            { submitLabel }
          </Button>
        </Footer>
      </Modal>

    );
  }
}