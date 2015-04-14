var React = require('react');

var ProfileShoutList = require('./tagProfileShoutList.jsx');

module.exports = React.createClass({
	displayName: "TagProfileRequests",

	statics: {
		fetchData: function (client, session, params) {
			return client.tags().getShouts(session, params.tagName, 'request');
		}
	},

	render: function () {
		return <ProfileShoutList type="request" {...this.props}/>
	}
});