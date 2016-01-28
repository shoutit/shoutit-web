import React from 'react';
import {Grid} from '../helper';
import ProfilePictureCard from './cards/profilePictureCard.jsx';
import ProfileBioCard from './cards/profileBioCard.jsx';
import ProfileButtonsCard from './cards/profileButtonsCard.jsx';
import ProfilePagesCard from './cards/profilePagesCard.jsx';
import ProfileEditorCard from './cards/profileEditorCard.jsx';

export default React.createClass({
    displayName: "ProfileLeftBar",

    render() {
        const user = this.props.user,
              editMode = this.props.editMode;

        return (
            <Grid fluid={true}>
                <ProfilePictureCard editMode={editMode} user={user} />
                {editMode? 
                    <ProfileEditorCard user={user} />
                    :
                    <Grid fluid={true}>
                        <ProfileButtonsCard user={user} />
                        <ProfileBioCard user={user} />
                        <ProfilePagesCard user={user} />
                    </Grid>
                }
            </Grid>
        );
    }
});