/* eslint-env browser */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import request from '../utils/request';
import { getFilename } from '../utils/StringUtils';

import { openModal } from '../actions/ui';
import { updateProfile } from '../actions/users';

import AvatarEditorModal from '../users/AvatarEditorModal';
import ProfileAvatar from '../users/ProfileAvatar';
import FileInput from '../forms/FileInput';

import './ProfileAvatarEditable.scss';

import GenericModal from '../modals/GenericModal';
import Icon from '../widgets/Icon';

const MESSAGES = defineMessages({
  header: {
    id: 'profileAvatarEditable.modal.header',
    defaultMessage: 'Are you sure?',
  },
  body: {
    id: 'profileAvatarEditable.modal.body',
    defaultMessage: 'Delete your profile picture?',
  },
  confirm: {
    id: 'profileAvatarEditable.modal.confirm',
    defaultMessage: 'Confirm',
  },
  cancel: {
    id: 'profileAvatarEditable.modal.cancel',
    defaultMessage: 'Cancel',
  },
});

export class ProfileAvatarEditable extends Component {

  static propTypes = {
    ...ProfileAvatar.PropTypes,
    intl: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired,
    updateProfile: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.handleFileInputChange = this.handleFileInputChange.bind(this);
    this.openAvatarEditorModal = this.openAvatarEditorModal.bind(this);
    this.handleImageDelete = this.handleImageDelete.bind(this);
    this.state = {
      image: props.profile.image,
    };
  }

  openAvatarEditorModal(image, profile) {
    openModal(
      <AvatarEditorModal initialImage={ image } profile={ profile } />
    );
  }

  handleFileInputChange(e) {
    const { files } = e.target;
    if (files && files.length > 0) {
      const { profile } = this.props;
      const fileReader = new FileReader();
      fileReader.onload = event => this.openAvatarEditorModal(event.target.result, profile);
      fileReader.readAsDataURL(files[0]);
    }
  }

  handleImageDelete() {
    const { profile, intl: { formatMessage }, openModal, updateProfile } = this.props;

    openModal(
      <GenericModal
        header={ formatMessage(MESSAGES.header) }
        actions={ [
          { label: formatMessage(MESSAGES.cancel) },
          {
            label: formatMessage(MESSAGES.confirm),
            kind: 'primary',
            onClick: () => {
              request
                .delete('/api/file/user')
                .query({ name: getFilename(profile.image) })
                .end((err, res) => {
                  if (err || !res.ok) {
                    console.error(err); // eslint-disable-line
                    return;
                  }
                });

              updateProfile({ id: profile.id, image: null });
            },
          },
        ] }
      >
        { formatMessage(MESSAGES.body) }
      </GenericModal>
    );
  }

  render() {
    const { profile } = this.props;
    return (
      <span
        className="ProfileAvatarEditable"
        onClick={ profile.image ? () => this.openAvatarEditorModal(profile.image, profile) : null }>
        <FileInput
          name="avatar"
          disabled={ !!profile.image }
          onChange={ this.handleFileInputChange }>
          <ProfileAvatar { ...this.props } />
          <span className="ProfileAvatarEditable-instructions">
            <FormattedMessage
              id="profileAvatar.editButton"
              defaultMessage="{hasImage, select,
                true {Change picture}
                false {Set profile picture}
              }"
              values={ { hasImage: !!profile.image } }
            />
            { profile.image &&
              <span onClick={ this.handleImageDelete }>
                <Icon name="trash" fill />
              </span>
            }
          </span>
        </FileInput>
      </span>
    );
  }

}

const mapDispatchToProps = dispatch => ({
  openModal: modal => dispatch(openModal(modal)),
  updateProfile: profile => dispatch(updateProfile(profile)),
});
export default connect(null, mapDispatchToProps)(injectIntl(ProfileAvatarEditable));
