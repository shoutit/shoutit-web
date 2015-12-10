import React from 'react';
import TagsCard from '../cards/tagsCard.jsx';
import ListenToCard from '../cards/listenToCard.jsx';
import SuggestShoutCard from '../cards/suggestShoutCard.jsx';
import ShoutOwnerCard from '../cards/shoutOwnerCard.jsx';

export default React.createClass({
    displayName: "RightBoard",

    render() {
        return (
            <div>
                <ShoutOwnerCard />
                <TagsCard />
                <ListenToCard />
                <SuggestShoutCard />
            </div>
        );
    }
});
