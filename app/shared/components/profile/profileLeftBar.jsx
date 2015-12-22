import React from 'react';
import {Grid} from '../helper';
import ProfilePictureCard from './cards/profilePictureCard.jsx';
import ProfileBioCard from './cards/profileBioCard.jsx';
import ProfileButtonsCard from './cards/profileButtonsCard.jsx';
import ProfilePagesCard from './cards/profilePagesCard.jsx';

export default React.createClass({
    displayName: "ProfileLeftBar",

    render() {
        let user = this.props.user;
        return (
            <Grid fluid={true}>
                <ProfilePictureCard user={user} />
                <ProfileButtonsCard user={user} />
                <ProfileBioCard user={user} />
                <ProfilePagesCard user={user} />
            </Grid>
        );
    }
});