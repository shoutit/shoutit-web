import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { openModal, closeModal } from '../actions/ui';

import AvatarEditor from '../users/AvatarEditor';
import ProfileAvatar from '../users/ProfileAvatar';
import Modal from '../ui/Modal';
import FileInput from '../ui/FileInput';

if (process.env.BROWSER) {
  require('./ProfileAvatarEditable.scss');
}

export class ProfileAvatarEditable extends Component {

  static propTypes = {
    ...ProfileAvatar.PropTypes,
    openModal: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.openAvatarEditor = this.openAvatarEditor.bind(this);
    this.handleFileInputChange = this.handleFileInputChange.bind(this);
    this.state = {
      image: props.profile.image,
    };
  }

  openAvatarEditor(image) {
    const modalName = 'avatar-editor';
    const { closeModal, openModal, profile } = this.props;

    const modal = (
      <Modal name={ modalName }>
        <AvatarEditor
          image={ image }
          profile={ profile }
          onCancel={ () => closeModal(modalName) }
          onSuccess={ () => closeModal(modalName) }
        />
      </Modal>
    );
    openModal(modal);
  }

  handleFileInputChange(e) {
    const { files } = e.target;
    if (files && files.length > 0) {
      const fileReader = new FileReader();
      fileReader.onload = event => this.openAvatarEditor(event.target.result);
      fileReader.readAsDataURL(files[0]);
    }
  }

  render() {
    const { profile } = this.props;
    return (
      <span
        className="ProfileAvatarEditable"
        onClick={ profile.image ? () => this.openAvatarEditor(profile.image) : null }
      >
        <FileInput
          name="avatar"
          disabled={ !!profile.image }
          onChange={ this.handleFileInputChange }>
          <ProfileAvatar {...this.props} />
          <span className="ProfileAvatarEditable-instructions">
            { profile.image ? 'Change picture' : 'Set profile picture' }
          </span>
        </FileInput>
      </span>
    );
  }

}

const mapDispatchToProps = dispatch => ({
  openModal: name => dispatch(openModal(name)),
  closeModal: name => dispatch(closeModal(name)),
});
export default connect(null, mapDispatchToProps)(ProfileAvatarEditable);
