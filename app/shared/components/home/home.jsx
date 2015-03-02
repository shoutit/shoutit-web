var React = require('react'),
	DocumentTitle = require('react-document-title');

var Feed = require('./feed.jsx');

module.exports = React.createClass({
	displayName: "Home",
	title: "Home - Shout It",

	render: function () {
		return (
			<DocumentTitle title={this.title}>
				<Feed flux={this.props.flux}/>
			</DocumentTitle>
		);
	}
});