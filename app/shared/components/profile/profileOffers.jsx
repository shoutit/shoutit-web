import React from 'react';

import ProfileShoutList from './profileShoutList.jsx';

export default React.createClass({
    displayName: "ProfileOffers",

    statics: {
        fetchData(client, session, params) {
            return client.users().getShouts(session, params.username, 'offer');
        }
    },

    render() {
        return (<ProfileShoutList type="offer" {...this.props}/>);
    }
});
