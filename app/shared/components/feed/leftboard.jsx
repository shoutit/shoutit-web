import React from 'react';
import ProfileCard from '../cards/profileCard.jsx';
import ListeningCard from '../cards/listeningCard.jsx';
import PagesCard from '../cards/pagesCard.jsx';
import ShareShoutCard from '../cards/shareShoutCard.jsx';
import SearchCard from '../cards/searchCard.jsx';
import RelatedTagsCard from '../cards/relatedTagsCard.jsx';
import TagProfileCard from '../cards/tagProfileCard.jsx';

export default React.createClass({
    displayName: "LeftBoard",

    render() {
        return (
            <div>
                <TagProfileCard />
                <RelatedTagsCard />
                <SearchCard />
                <ShareShoutCard />
                <ProfileCard />
                <ListeningCard />
                <PagesCard />
            </div>
        );
    }
});
