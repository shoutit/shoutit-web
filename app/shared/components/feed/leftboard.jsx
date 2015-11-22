import React from 'react';
import ProfileCard from '../cards/profileCard.jsx';
import ListeningCard from '../cards/listeningCard.jsx';
import PagesCard from '../cards/pagesCard.jsx';

export default React.createClass({
    displayName: "LeftBoard",

    render() {
        return (
            <div>
                <ProfileCard />
                <ListeningCard />
                <PagesCard />
            </div>
        );
    }
});
