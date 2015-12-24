import React from 'react';
import {Grid, Icon} from '../../helper';
import UserImage from '../../user/userImage.jsx';

export default React.createClass({
    displayName: "ProfileLeftBar",

    propTypes: {
        user: React.PropTypes.object.isRequired
    },

    renderEditLayer() {
        return (
            <div className="profile-picture-editbox">
                <Icon name="edit-photo" />
            </div>
            );
    },

    render() {
        let user = this.props.user,
            imageStyle = {
                position: "relative",
                margin: "-63px auto 0",
                border: "2px solid white",
                boxShadow: "0 0px 6px rgba(0, 0, 0, 0.3)"
            };

        return (
            <Grid fluid={true} style={{position: "relative"}}>
                <UserImage image={user.image}
                           size="126"
                           type="rounded2x"
                           style={imageStyle} />
                {this.props.editMode && this.renderEditLayer()}
                <h2 className="si-name">{user.name}</h2>
            </Grid>
        );
    }
});