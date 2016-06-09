import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { openModal } from '../actions/ui';

import AvatarEditorModal from '../users/AvatarEditorModal';
import ProfileAvatar from '../users/ProfileAvatar';
import FileInput from '../ui/FileInput';

if (process.env.BROWSER) {
  require('./ProfileAvatarEditable.scss');
}

export class ProfileAvatarEditable extends Component {

  static propTypes = {
    ...ProfileAvatar.PropTypes,
    openModal: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.handleFileInputChange = this.handleFileInputChange.bind(this);
    this.state = {
      image: props.profile.image,
    };
  }

  handleFileInputChange(e) {
    const { files } = e.target;
    if (files && files.length > 0) {
      const { openModal, profile } = this.props;
      const fileReader = new FileReader();
      fileReader.onload = event => openModal(event.target.result, profile);
      fileReader.readAsDataURL(files[0]);
    }
  }

  render() {
    const { profile, openModal } = this.props;
    return (
      <span
        className="ProfileAvatarEditable"
        onClick={ profile.image ? () => openModal(profile.image, profile) : null }>
        <FileInput
          name="avatar"
          disabled={ !!profile.image }
          onChange={ this.handleFileInputChange }>
          <ProfileAvatar {...this.props} />
          <span className="ProfileAvatarEditable-instructions">
            <FormattedMessage
              id="profileAvatar.editButton"
              defaultMessage="{hasImage, select,
                true {Change picture}
                false {Set profile picture}
              }"
              values={ { hasImage: !!profile.image } }
            />
          </span>
        </FileInput>
      </span>
    );
  }

}

const mapDispatchToProps = dispatch => ({
  openModal: (image, profile) => dispatch(openModal(
    <AvatarEditorModal initialImage={ image } profile={ profile } />
  )),
});
export default connect(null, mapDispatchToProps)(ProfileAvatarEditable);
