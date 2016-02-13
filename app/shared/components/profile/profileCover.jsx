import React from 'react';
import {Grid, Icon} from '../helper';
import Button from '../general/button.jsx';
import AvatarEditor from 'react-avatar-editor';

export default React.createClass({
    displayName: "ProfileCover",

    contextTypes: {
        flux: React.PropTypes.object
    },

    getInitialState() {
        return {
            coverEditBox: false,
            editedImage: null
        }
    },

    renderCoverPhoto() {
        // placeholder cover
        let image = this.props.user.cover || 'http://data.hdwallpapers.im/beautiful_sunrise_over_valley.jpg';
        let imgStyle = {
            backgroundImage: `url('${image}')`
        };

        if(this.state.coverEditBox) {
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
                      scale={1.0} />
                    {this.renderSaveCancelButtons()}
                  </div>
                );
        } else {
            return (
                <Grid fluid={true} className="profile-cover" style={imgStyle}>
                    {this.renderEditControls()}
                </Grid>
                );
        }
    },

    renderEditControls() {
        const editMode = this.props.editMode;
        if(editMode) {

            return (
                <Grid fluid={true} className="profile-cover-editmode">
                    {/* Could be refactored as a separate image edit layer component to handle uploads*/}
                    <label>
                        <input type="file" accept=".jpg,.png" onChange={this.handleImageFile} style={{position: "fixed", top: "-100em"}} />
                        <Grid fluid={true} className="img-holder">
                            <Icon name="edit-photo" />
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
        if(editMode) {
            const waitingMsg = this.props.profile.profilePictureUploading? "Uploading Profile Picture":
                    this.props.profile.coverUploading? "Uploading Cover Image":
                    this.props.profile.status === "saving"? "Saving ...":
                    null;
            const saveBtnClass = waitingMsg? "save-btn disabled pull-right": "save-btn pull-right";

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
        const isOwner = this.props.user.is_owner;
        const editMode = this.props.editMode;

        if(isOwner && !editMode) {
            return (
                <div className="profile-cover-edit-button" onClick={this.onEditClicked}>
                    <Icon name="edit-white" />
                    <span>Edit Profile</span>
                </div>
                );
        } else {
            return null;
        }
    },

    handleImageFile(ev) {
        const files = ev.target.files;

        if(files && files[0]) {
            // Reading file from users' computer and converting to Data URL
            let FR = new FileReader();
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
        if(this.state.coverEditBox) {
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
        if(this.props.onModeChange) {
            this.props.onModeChange({editMode: mode});
        }
    },

    componentDidUpdate(){
        if(!this.props.editMode && this.state.coverEditBox) {
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
