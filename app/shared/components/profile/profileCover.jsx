import React from 'react';
import {Grid} from '../helper';

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
        return null;
    },

    render() {
        return (
            <div>
                {this.renderCoverPhoto()}
            </div>
        );
    }
});