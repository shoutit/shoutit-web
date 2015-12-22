import React from 'react';

import ProfileShoutList from './profileShoutList.jsx';

export default React.createClass({
    displayName: "ProfileOffers",

    render() {
        return (<ProfileShoutList type="offer" {...this.props}/>);
    }
});
