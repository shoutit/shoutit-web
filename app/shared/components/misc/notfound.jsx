var React = require('react'),
	DocumentTitle = require('react-document-title');

module.exports = React.createClass({
	displayName: "NotFound",

	title: "Not Found - Shout It",

	render: function () {
		return (
			<DocumentTitle title={this.title}>
				<div>
					Page not Found!
				</div>
			</DocumentTitle>
		);
	}
});

