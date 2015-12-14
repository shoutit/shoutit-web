import React from 'react';
import ProfileCard from '../cards/profileCard.jsx';
import ListeningCard from '../cards/listeningCard.jsx';
import PagesCard from '../cards/pagesCard.jsx';
import ShareShoutCard from '../cards/shareShoutCard.jsx';
import SearchCard from '../cards/searchCard.jsx';

export default React.createClass({
    displayName: "LeftBoard",

    render() {
        return (
            <div>
                <SearchCard />
                <ShareShoutCard />
                <ProfileCard />
                <ListeningCard />
                <PagesCard />
            </div>
        );
    }
});
