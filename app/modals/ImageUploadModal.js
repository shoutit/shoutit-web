/* eslint-env browser */
import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import FileUploadField from '../forms/FileUploadField';
import Form from '../forms/Form';
import Button from '../forms/Button';
import Modal, { Header, Footer, Body } from '../modals';

export default class ImageUploadModal extends Component {

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    openOnMount: PropTypes.bool,
    max: PropTypes.number,
    initialImages: PropTypes.array,
  }

  static defaultProps = {
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
    this.modal.hide();
  }

  render() {

    let submitLabel = (
      <FormattedMessage
        id="ui.imageUploadModal.submitLabel"
        values={ {
          imagesCount: this.state.images.length,
        } }
        defaultMessage="{imagesCount, plural,
          one {Send image}
          two {Send # images}
          other {Send # images}
        }" />
    );
    if (this.state.isUploading) {
      submitLabel = (
        <FormattedMessage
          id="ui.imageUploadModal.uploadingLabel"
          defaultMessage="Uploading…" />
      );
    }

    return (
      <Modal { ...this.props } ref={ el => { this.modal = el; } } size="x-small">
        <Header closeButton>
          <FormattedMessage
            id="ui.imageUploadModal.title"
            defaultMessage="Upload images"
          />
        </Header>
        <Body>
          <Form onSubmit={ this.submit }>
            <FormattedMessage
              id="ui.imageUploadModal.fieldLabel"
              defaultMessage="Upload images"
            >
              { message =>
                <FileUploadField
                  ref={ el => { this.fileUploadField = el; } }
                  name="images"
                  resourceType="shout"
                  label={ message }
                  disabled={ false }
                  onChange={ images => this.handleChange({ images }) }
                  onUploadStart={ this.handleUploadStart }
                  onUploadEnd={ this.handleUploadEnd }
                  error={ null }
                  accept="image/png,image/jpeg"
                  max={ this.props.max }
                />
              }
            </FormattedMessage>
          </Form>
        </Body>
        <Footer>
          <Button key="cancel" type="button" onClick={ this.hide }>
            <FormattedMessage
              id="ui.imageUploadModal.CancelButton"
              defaultMessage="Cancel"
            />
          </Button>
          <Button onClick={ this.submit } size="small" key="submit" kind="primary" disabled={ this.state.isUploading || this.state.images.length === 0 }>
            { submitLabel }
          </Button>
        </Footer>
      </Modal>

    );
  }
}
