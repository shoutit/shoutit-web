/* eslint-disable no-alert */
/* eslint-env browser */

import React, { PropTypes, Component } from 'react';
import ReactAvatarEditor from 'react-avatar-editor';
import { FormattedMessage, injectIntl } from 'react-intl';

import { connect } from 'react-redux';
import { updateProfile } from '../actions/users';
import request from '../utils/request';

import Form from '../forms/Form';
import Button from '../forms/Button';
import Modal, { Header, Body, Footer } from '../modals';
import UploadButton from '../forms/UploadButton';
import './AvatarEditorModal.scss';

export const width = 250;
export const height = 250;

export class AvatarEditorModal extends Component {

  static propTypes = {
    initialImage: PropTypes.string.isRequired,
    profile: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.cancelEditing = this.cancelEditing.bind(this);
    this.handlePictureChange = this.handlePictureChange.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleScale = this.handleScale.bind(this);
    this.state = {
      image: props.initialImage,
      uploadRequest: null,
      scale: 1,
    };
  }

  componentDidMount() {
    this.cancelButton.focus();
  }

  modal = null
  editor = null
  scale = null
  cancelButton = null

  handleSaveClick() {
    const { profile, dispatch } = this.props;
    const image = this.editor.getImageScaledToCanvas().toDataURL();

    const uploadRequest = request.post('/api/file/user')
        .send({ image })
        .end((err, res) => {
          if (err) {
            this.setState({
              isSubmitting: false,
              uploadRequest: null,
              image: profile.image,
            });
            return;
          }
          this.setState({ uploadRequest: null });
          dispatch(updateProfile({ id: profile.id, image: res.text }))
            .then(() => this.cancelEditing());
        });

    this.setState({
      isSubmitting: true,
      uploadRequest,
    });

  }

  handlePictureChange(e) {
    const { files } = e.target;
    if (files && files.length > 0) {
      const fileReader = new FileReader();
      fileReader.onload = event => this.setState({
        image: event.target.result,
      });
      fileReader.readAsDataURL(files[0]);
    }
  }

  handleScale() {
    const scale = parseFloat(this.scale.value);
    this.setState({ scale });
  }

  handleDrop() {
    this.setState({
      image: this.editor.getImage(),
    });
  }

  cancelEditing() {
    if (this.state.uploadRequest) {
      this.state.uploadRequest.abort();
    }
    this.modal.hide();
  }

  render() {
    return (
      <Modal
        { ...this.props }
        autoSize={ false }
        ref={ el => this.modal = el }
        isSubmitting={ this.state.isSubmitting }>
        <Header closeButton>
          <FormattedMessage
            id="avatarEditor.title"
            defaultMessage="Change Your Picture"
          />
        </Header>
        <Body>
          <Form className="AvatarEditorModal">
            <div>
              <ReactAvatarEditor
                scale={ this.state.scale }
                ref={ el => this.editor = el }
                width={ width }
                height={ height }
                image={ this.state.image }
                border={ 0 }
                onDropFile={ this.handleDrop }
              />
            </div>
            <div style={ { visibility: (this.state.image && this.props.profile.image !== this.state.image) ? '' : 'hidden' } }>
              <input
                disabled={ this.state.isSubmitting }
                name="scale"
                type="range"
                ref={ el => this.scale = el }
                onChange={ this.handleScale }
                min="1"
                max="3"
                step="0.01"
                defaultValue="1"
              />
            </div>
          </Form>
        </Body>
        <Footer>
          <Button
            ref={ el => this.cancelButton = el }
            onClick={ () => this.modal.hide() }
            size="small" disabled={ this.state.isSubmitting }>
            <FormattedMessage
              id="avatarEditor.cancelButton"
              defaultMessage="Cancel"
            />
          </Button>

          <UploadButton
            name="upload-image"
            accept="image/jpeg,image/png"
            kind="secondary"
            icon="camera"
            disabled={ this.state.isSubmitting }
            onChange={ this.handlePictureChange }>
            <FormattedMessage
              id="avatarEditor.uploadButton"
              defaultMessage="Upload image"
            />
          </UploadButton>

          { this.state.image && this.props.profile.image !== this.state.image &&
            <Button
              onClick={ this.handleSaveClick }
              kind="primary"
              disabled={ this.props.profile.image === this.state.image || this.state.isSubmitting }
              style={ { minWidth: 120 } }>
              <FormattedMessage
                id="avatarEditor.saveButton"
                defaultMessage="Save changes"
              />
            </Button>
          }

        </Footer>
      </Modal>
    );
  }
}

export default connect()(injectIntl(AvatarEditorModal));
