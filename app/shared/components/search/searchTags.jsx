var React = require('react');

var SearchTagList = require('./searchTagList.jsx');

module.exports = React.createClass({
	displayName: "SearchTags",

	statics: {
		fetchData: function (client, session, params) {
			return client.tags().search(session, {
				search: params.term
			});
		}
	},

	render: function () {
		return <SearchTagList {...this.props}/>
	}
});