var React = require('react'),
	DocumentTitle = require('react-document-title');

module.exports = React.createClass({
	displayName: "Simple",

	title: "Shout It- Not implemented yet.",

	render: function () {
		return (
			<DocumentTitle title={this.title}>
				<div>
					Not implemented yet.
				</div>
			</DocumentTitle>
		);
	}
});
