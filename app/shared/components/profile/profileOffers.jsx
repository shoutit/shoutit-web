var React = require('react');

var ProfileShoutList = require('./profileShoutList.jsx');

module.exports = React.createClass({
    displayName: "ProfileOffers",

    statics: {
        fetchData: function (client, session, params) {
            return client.users().getShouts(session, params.username, 'offer');
        }
    },

    render: function () {
        return (<ProfileShoutList type="offer" {...this.props}/>);
    }
});
