import React from 'react';
import {Grid, Icon} from '../helper';
import Button from '../general/button.jsx';

export default React.createClass({
    displayName: "ProfileCover",

    renderCoverPhoto() {
        // mock data
        let image = this.props.user.cover || 'http://data.hdwallpapers.im/beautiful_sunrise_over_valley.jpg';
        let imgStyle = {
            backgroundImage: `url('${image}')`
        };

        return (
            <Grid fluid={true} className="profile-cover" style={imgStyle}>
                {this.renderEditControls()}
            </Grid>
            )
    },

    renderEditControls() {
        const editMode = this.props.editMode;

        if(editMode) {
            return (
                <Grid fluid={true} className="profile-cover-editmode">
                    <Grid fluid={true} className="img-holder">
                        <Icon name="edit-photo" />
                        <h3>Change your cover image</h3>
                    </Grid>
                    <Grid fluid={true} className="buttons-holder">
                        <span onClick={this.onEditCancel} className="cancel-btn pull-right">Cancel</span>
                        <span className="save-btn pull-right">Save Changes</span>
                    </Grid>
                </Grid>
                );
        } else {
            return null;
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

    onEditClicked() {
        this.setEditMode(true);
    },

    onEditCancel() {
        this.setEditMode(false);
    },

    setEditMode(mode) {
        if(this.props.onModeChange) {
            this.props.onModeChange({editMode: mode});
        }
    },

    render() {
        return (
            <Grid fluid={true}>
                {this.renderCoverPhoto()}
                {this.renderEditButton()}
            </Grid>
        );
    }
});