import React from 'react';
import {Grid, Icon} from '../../helper';
import UserImage from '../../user/userImage.jsx';
import AvatarEditor from 'react-avatar-editor';
import Dialog from 'material-ui/lib/dialog';

export default React.createClass({
    displayName: "ProfileLeftBar",

    contextTypes: {
        flux: React.PropTypes.object
    },

    propTypes: {
        user: React.PropTypes.object.isRequired
    },

    getInitialState() {
        return {
            editBox: false,
            editedImage: null
        }
    },

    renderEditLayer() {
        return (
            <label>
                <input type="file" accept=".jpg,.png" onChange={this.handleImageFile} style={{position: "fixed", top: "-100em"}} />
                <div className="profile-picture-editbox">
                    <Icon name="edit-photo" />
                </div>
            </label>
            );
    },

    handleImageFile(ev) {
        const files = ev.target.files;

        if(files && files[0]) {
            // Reading file from users' computer and converting to Data URL
            let FR = new FileReader();
            FR.onload = (e) => {
                this.imageData = e.target.result;
                this.setState({editBox: true});
            };
            FR.readAsDataURL(files[0]);
        }
    },

    handleEditBoxClose() {
        this.setState({editBox: false});
    },

    handleEditBoxDone() {
        const flux = this.context.flux;
        const editedImage = this.refs.editor.getImage();
        this.setState({editedImage: editedImage, editBox: false});
        // Upload image to S3
        flux.actions.uploadProfilePicture(editedImage);
    },

    renderAvatarEditor() {
        let standardActions = [
          <span className="green-btn" onClick={this.handleEditBoxDone}>Done</span>,
          <span className="gray-btn" onClick={this.handleEditBoxClose}>Cancel</span>
        ];

        return (
            <Dialog
              contentClassName="profile-picture-dialog"
              actions={standardActions}
              actionFocus="submit"
              open={this.state.editBox}
              onRequestClose={this.handleEditBoxClose}>
                <Grid fluid={true} style={{textAlign: "center"}} className="profile-picture-editmodal">
                    <p>Fit your profile picture by moving the image</p>
                    <AvatarEditor 
                      image={this.imageData}
                      width={126}
                      height={126}
                      border={0}
                      color={[255, 255, 255, 0.3]} // RGBA
                      style={{borderRadius: "5px", cursor: "move"}}
                      ref="editor"
                      scale={1.8} />
                </Grid>
              </Dialog>
            );
    },

    render() {
        let user = this.props.user,
            editMode = this.props.editMode,
            imageStyle = {
                position: "relative",
                margin: "-63px auto 0",
                border: "2px solid white",
                boxShadow: "0 0px 6px rgba(0, 0, 0, 0.3)"
            };

        // use data uri image only in edit mode
        const userImage = editMode? this.state.editedImage || user.image: user.image;

        return (
            <Grid fluid={true} style={{position: "relative"}}>
                <UserImage image={userImage}
                           size="126"
                           type="rounded2x"
                           style={imageStyle} />
                {editMode && this.renderEditLayer()}
                <h2 className="si-name">{user.name}</h2>
                {this.renderAvatarEditor()}
            </Grid>
        );
    }
});