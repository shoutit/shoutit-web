/** @jsx React.DOM */

var React = require('react');

module.exports = TagList = React.createClass({
	getDefaultProps: function () {
		return {
			tags: []
		};
	},

	render: function () {
		var children = this.props.tags.map(function (tag) {
			return (
				<li key={"tag-" + tag}>{tag}</li>
			);
		});

		return (
			<ul className="tags col-md-6">
				{children}
			</ul>
		);
	}
});