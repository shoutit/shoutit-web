import React from 'react';
import TagsCard from '../cards/tagsCard.jsx';
import ListenToCard from '../cards/listenToCard.jsx';
import ShoutCard from '../cards/shoutCard.jsx';

export default React.createClass({
    displayName: "RightBoard",

    render() {
        return (
            <div>
                <TagsCard />
                <ListenToCard />
                <ShoutCard />
            </div>
        );
    }
});
