var React = require('react'),
	DocumentTitle = require('react-document-title');

module.exports = React.createClass({
	displayName: "Simple",

	title: "Simple - Shout It",

	render: function () {
		return (
			<DocumentTitle title={this.title}>
				<div>
					Dummy Page
				</div>
			</DocumentTitle>
		);
	}
});
