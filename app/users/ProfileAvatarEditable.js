/* eslint-env browser */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import request from '../utils/request';
import { getFilename } from '../utils/StringUtils';

import { openModal, confirm } from '../actions/ui';
import { updateProfile } from '../actions/users';

import AvatarEditorModal from '../users/AvatarEditorModal';
import ProfileAvatar from '../users/ProfileAvatar';
import FileInput from '../forms/FileInput';

import './ProfileAvatarEditable.scss';

const MESSAGES = defineMessages({
  header: {
    id: 'profileAvatarEditable.modal.header',
    defaultMessage: 'Do you want to remove your picture?',
  },
  body: {
    id: 'profileAvatarEditable.modal.body',
    defaultMessage: 'Your profile will be less recognizable without a picture.',
  },
  confirm: {
    id: 'profileAvatarEditable.modal.confirm',
    defaultMessage: 'Remove',
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
    confirm: PropTypes.func.isRequired,
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
    this.props.openModal(
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

  handleImageDelete(e) {
    e.preventDefault();
    e.stopPropagation();
    const { profile, intl: { formatMessage }, confirm, updateProfile } = this.props;

    confirm(
      formatMessage(MESSAGES.header),
      formatMessage(MESSAGES.body),
      [
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
      ]
    );
  }

  render() {
    const { profile } = this.props;

    return (
      <span
        className="ProfileAvatarEditable"
        >
        <FileInput
          name="avatar"
          onChange={ this.handleFileInputChange }>
          <ProfileAvatar { ...this.props } />
          <div className="ProfileAvatarEditable-instructions">
            <div>
              <FormattedMessage
                id="profileAvatar.editButton"
                defaultMessage="{hasImage, select,
                  true {Click to change your profile picture}
                  false {Click to set your profile picture}
                }"
                values={ { hasImage: !!profile.image } }
              />
            </div>
            { profile.image &&
              <div className="ProfileAvatarEditable-delete" onClick={ this.handleImageDelete }>
                <FormattedMessage
                  id="profileAvatar.removeButton"
                  defaultMessage="Remove"
                />
              </div>
            }
          </div>
        </FileInput>
      </span>
    );
  }

}

const mapDispatchToProps = dispatch => bindActionCreators({
  openModal,
  confirm,
  updateProfile,
}, dispatch);

export default connect(null, mapDispatchToProps)(injectIntl(ProfileAvatarEditable));
