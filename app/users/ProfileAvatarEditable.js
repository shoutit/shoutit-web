import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { openModal, closeModal } from '../actions/ui';

import AvatarEditor from '../users/AvatarEditor';
import ProfileAvatar from '../users/ProfileAvatar';
import FileInput from '../ui/FileInput';

if (process.env.BROWSER) {
  require('./ProfileAvatarEditable.scss');
}

export class ProfileAvatarEditable extends Component {

  static propTypes = {
    ...ProfileAvatar.PropTypes,
    openAvatarEditor: PropTypes.func.isRequired,
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
      const { openAvatarEditor, profile } = this.props;
      const fileReader = new FileReader();
      fileReader.onload = event => openAvatarEditor(event.target.result, profile);
      fileReader.readAsDataURL(files[0]);
    }
  }

  render() {
    const { profile, openAvatarEditor } = this.props;
    return (
      <span
        className="ProfileAvatarEditable"
        onClick={ profile.image ? () => openAvatarEditor(profile.image, profile) : null }
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
  openAvatarEditor: (image, profile) => dispatch(openModal(
    <AvatarEditor
      image={ image }
      profile={ profile }
      onCancel={ () => dispatch(closeModal()) }
      onSuccess={ () => dispatch(closeModal()) }
    />, { title: 'Update Your Picture' }
  )),
});
export default connect(null, mapDispatchToProps)(ProfileAvatarEditable);
