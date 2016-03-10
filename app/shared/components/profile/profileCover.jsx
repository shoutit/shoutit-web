import React from "react";
import { Grid, Icon } from "../helper";
import SVGIcon from "../helper/SVGIcon";
import AvatarEditor from "react-avatar-editor";

import { imagesPath } from "../../../../config";
var defaultCoverImage = `${imagesPath}/pattern@2x.png`;

if (process.env.BROWSER) {
  require("styles/components/ProfileCover.scss");
}

export default React.createClass({
  displayName: "ProfileCover",

  contextTypes: {
    flux: React.PropTypes.object
  },

  getInitialState() {
    return {
      coverEditBox: false,
      editedImage: null
    };
  },

  renderCoverPhoto() {
    // placeholder cover
    const image = this.props.user.cover || defaultCoverImage;
    const imgStyle = {
      backgroundImage: `url('${image}')`,
      backgroundSize: this.props.user.cover ? "100%" : "60%",
      backgroundRepeat: "repeat-x"
    };

    if (this.state.coverEditBox) {
      return (
        <div style={{position: "relative"}}>
          <AvatarEditor
            image={this.imageData}
            width={940}
            height={300}
            border={0}
            color={[255, 255, 255, 0.3]} // RGBA
            style={{borderRadius: "5px", cursor: "move"}}
            ref="coverEditor"
            scale={1.0}/>
          {this.renderSaveCancelButtons()}
        </div>
      );
    } else {
      return (
        <Grid fluid={true} className="ProfileCover" style={imgStyle}>
          {this.renderEditControls()}
        </Grid>
      );
    }
  },

  renderEditControls() {
    const editMode = this.props.editMode;
    if (editMode) {

      return (
        <Grid fluid={true} className="ProfileCover-editMode">
          {/* Could be refactored as a separate image edit layer component to handle uploads*/}
          <label>
            <input type="file" accept=".jpg,.png" onChange={this.handleImageFile}
                   style={{position: "fixed", top: "-100em"}}/>
            <Grid fluid={true} className="img-holder">
              <Icon name="edit-photo"/>
              <h3>Change your cover image</h3>
            </Grid>
          </label>
          {this.renderSaveCancelButtons()}
        </Grid>
      );
    } else {
      return null;
    }
  },

  renderSaveCancelButtons() {
    const editMode = this.props.editMode;
    if (editMode) {
      const waitingMsg = this.props.profile.profilePictureUploading ? "Uploading Profile Picture" :
        this.props.profile.coverUploading ? "Uploading Cover Image" :
          this.props.profile.status === "saving" ? "Saving ..." :
            null;
      const saveBtnClass = waitingMsg ? "save-btn disabled pull-right" : "save-btn pull-right";

      return (
        <Grid fluid={true} className="buttons-holder">
          <span onClick={this.onEditCancel} className="cancel-btn pull-right">Cancel</span>
          <span className={saveBtnClass} onClick={this.onEditSave}>
              {waitingMsg || "Save Changes"}
          </span>
        </Grid>
      );
    }
  },

  renderEditButton() {
    const { user, editMode } = this.props;
    const profileIsNotSet = !Boolean(user.cover);

    const buttonClass = profileIsNotSet? "ProfileCover-editButton default" : "ProfileCover-editButton";

    if (user.is_owner && !editMode) {
      return (
        <div className="ProfileCover-editHolder" onClick={this.onEditClicked}>
          <SVGIcon name="pencil" active={ profileIsNotSet } fill={ !profileIsNotSet }/>
          <span className={ buttonClass }>Edit Profile</span>
        </div>
      );
    } else {
      return null;
    }
  },

  handleImageFile(ev) {
    const files = ev.target.files;

    if (files && files[0]) {
      // Reading file from users' computer and converting to Data URL
      const FR = new FileReader();
      FR.onload = (e) => {
        this.imageData = e.target.result;
        this.setState({coverEditBox: true});
      };
      FR.readAsDataURL(files[0]);
    }
  },

  onEditClicked() {
    this.setEditMode(true);
  },

  onEditCancel() {
    this.setEditMode(false);
    this.setState({coverEditBox: false});
  },

  onEditSave() {
    const flux = this.context.flux;
    // chose action
    if (this.state.coverEditBox) {
      // first upload cover
      const editedImage = this.refs.coverEditor.getImage();
      flux.actions.uploadCoverImage(editedImage);
    } else {
      flux.actions.saveProfileChanges();
    }
    // this.setEditMode(false);
    // this.setState({coverEditBox: false});
  },

  setEditMode(mode) {
    if (this.props.onModeChange) {
      this.props.onModeChange({editMode: mode});
    }
  },

  componentDidUpdate() {
    if (!this.props.editMode && this.state.coverEditBox) {
      this.setState({coverEditBox: false});
    }
  },

  render() {
    return (
      <Grid fluid={true} style={{position: "relative"}}>
        {this.renderCoverPhoto()}
        {this.renderEditButton()}
      </Grid>
    );
  }
});
