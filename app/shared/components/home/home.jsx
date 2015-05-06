import React from 'react';
import DocumentTitle from 'react-document-title';

import Feed from './feed.jsx';

const titles = {
    "/": "Home",
    "/offers": "Offers",
    "/requests": "Requests"
};

const types = {
    offers: "offer",
    requests: "request",
    shouts: "all"
};

export default React.createClass({
    displayName: "Home",

    contextTypes: {
        router: React.PropTypes.func
    },

    statics: {
        fetchData(client, session, _, name) {
            return client.shouts().list(session, {
                shout_type: types[name] || "all",
                page_size: 5
            });
        }
    },

    render() {
        var pathName = this.context.router.getCurrentPathname();
        var title = titles[pathName] + " - Shoutit";

        return (
            <DocumentTitle title={title}>
                <Feed flux={this.props.flux} type={pathName.substr(1)}/>
            </DocumentTitle>
        );
    }
});
