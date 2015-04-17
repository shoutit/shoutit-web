var React = require('react');

var SearchShoutList = require('./searchShoutList.jsx');

module.exports = React.createClass({
	displayName: "SearchShouts",

	statics: {
		fetchData: function (client, session, params) {
			return client.shouts().list(session, {
				search: params.term
			});
		}
	},

	render: function () {
		return <SearchShoutList {...this.props}/>
	}
});