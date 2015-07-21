import React from 'react';

import ProfileShoutList from './profileShoutList.jsx';

export default React.createClass({
    displayName: "ProfileOffers",

    statics: {
        fetchData(client, session, params) {
            return client.users().getShouts(session, params.username, 'request');
        }
    },

    render() {
        return ( <ProfileShoutList type="request" {...this.props}/> );
    }
});
