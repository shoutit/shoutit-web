import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { openModal, closeModal } from '../actions/ui';

import AvatarEditor from '../users/AvatarEditor';
import ProfileAvatar from '../users/ProfileAvatar';
import Modal from '../ui/Modal';

if (process.env.BROWSER) {
  require('./ProfileAvatarEditable.scss');
}

export class ProfileAvatarEditable extends Component {

  static propTypes = {
    ...ProfileAvatar.PropTypes,
    openModal: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.openAvatarEditor = this.openAvatarEditor.bind(this);
  }

  openAvatarEditor() {
    const modalName = 'avatar-editor';
    const { closeModal, openModal, profile } = this.props;

    const modal = (
      <Modal name={ modalName }>
        <AvatarEditor
          profile={ profile }
          onCancel={ () => closeModal(modalName) }
          onSuccess={ () => closeModal(modalName) }
        />
      </Modal>
    );
    openModal(modal);
  }

  render() {
    return (
      <span className="ProfileAvatarEditable" onClick={ this.openAvatarEditor }>
        <ProfileAvatar {...this.props} />
      </span>
    );
  }

}

const mapDispatchToProps = dispatch => ({
  openModal: name => dispatch(openModal(name)),
  closeModal: name => dispatch(closeModal(name)),
});
export default connect(null, mapDispatchToProps)(ProfileAvatarEditable);
