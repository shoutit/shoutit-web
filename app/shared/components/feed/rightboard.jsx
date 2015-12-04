import React from 'react';
import TagsCard from '../cards/tagsCard.jsx';
import ListenToCard from '../cards/listenToCard.jsx';
import ShoutCard from '../cards/shoutCard.jsx';
import ShoutOwnerCard from '../cards/shoutOwnerCard.jsx';

export default React.createClass({
    displayName: "RightBoard",

    render() {
        return (
            <div>
                <ShoutOwnerCard />
                <TagsCard />
                <ListenToCard />
                <ShoutCard />
            </div>
        );
    }
});
