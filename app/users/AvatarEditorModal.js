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

export const width = 250;
export const height = 250;

import './AvatarEditorModal.scss';

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
    this.hide = this.hide.bind(this);
    this.state = {
      image: props.initialImage,
      uploadRequest: null,
      scale: 1,
    };
  }

  componentDidMount() {
    this.refs.cancelButton.focus();
  }

  hide() {
    this.refs.modal.hide();
  }

  handleSaveClick() {
    const { profile, dispatch } = this.props;
    const image = this.refs.editor.getImageScaledToCanvas().toDataURL();

    const uploadRequest = request.post('/api/file/user')
        .send({ image })
        .end((err, res) => {
          if (err) {
            this.setState({
              isLoading: false,
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
      isLoading: true,
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
    const scale = parseFloat(this.refs.scale.value);
    this.setState({ scale });
  }

  handleDrop() {
    this.setState({
      image: this.refs.editor.getImage(),
    });
  }

  cancelEditing() {
    if (this.state.uploadRequest) {
      this.state.uploadRequest.abort();
    }
    this.hide();
  }

  render() {
    return (
      <Modal { ...this.props } ref="modal" preventClose={ this.state.isLoading }>
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
                ref="editor"
                width={ width }
                height={ height }
                image={ this.state.image }
                border={ 0 }
                onDropFile={ this.handleDrop }
              />
            </div>
            <div style={ { visibility: (this.state.image && this.props.profile.image !== this.state.image) ? '' : 'hidden' } }>
              <input
                disabled={ this.state.isLoading }
                name="scale"
                type="range"
                ref="scale"
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
          <Button key="cancel" ref="cancelButton" onClick={ this.hide } size="small" disabled={ this.state.isLoading }>
            <FormattedMessage
              id="avatarEditor.cancelButton"
              defaultMessage="Cancel"
            />
          </Button>

          <UploadButton
            key="upload"
            name="upload-image"
            accept="image/jpeg,image/png"
            kind="secondary"
            icon="camera"
            disabled={ this.state.isLoading }
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
              disabled={ this.props.profile.image === this.state.image || this.state.isLoading }
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
