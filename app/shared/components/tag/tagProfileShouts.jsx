import React from 'react';

import ProfileShoutList from './tagProfileShoutList.jsx';

export default React.createClass({
    displayName: "TagProfileShouts",

    // statics: {
    //     fetchId: 'tagshouts',
    //     fetchData(client, session, params) {
    //         return client.shouts().list(session, { tags: params.tagName, country: params.countryCode });
    //     }
    // },

    render() {
        return (
            <ProfileShoutList type="all" {...this.props}/>
        );
    }
});
