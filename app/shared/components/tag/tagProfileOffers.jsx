var React = require('react');

var ProfileShoutList = require('./tagProfileShoutList.jsx');

module.exports = React.createClass({
	displayName: "TagProfileOffers",

	statics: {
		fetchData: function (client, session, params) {
			return client.tags().getShouts(session, params.tagName, 'offer');
		}
	},

	render: function () {
		return <ProfileShoutList type="offer" {...this.props}/>
	}
});