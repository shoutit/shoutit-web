import React from 'react';
import {Grid} from '../../helper';
import ProfilePictureCard from '../cards/profilePictureCard.jsx';
import ProfileButtonsCard from '../cards/profileButtonsCard.jsx';
import PageAdminsCard from '../cards/pageAdminsCard.jsx';

export default React.createClass({
    displayName: "ProfileLeftBar",

    render() {
        let user = this.props.user;
        return (
            <Grid fluid={true}>
                <ProfilePictureCard user={user} />
                <ProfileButtonsCard user={user} />
                {/*<PageAdminsCard user={user} />*/}
            </Grid>
        );
    }
});
