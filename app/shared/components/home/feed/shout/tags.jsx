var React = require('react'),
	Link = require('react-router').Link;

var Icon = require('../../../helper/icon.jsx'),
	Tag = require('./tag.jsx');

module.exports = React.createClass({
	displayName: "TagList",

	getDefaultProps: function () {
		return {
			tags: []
		};
	},

	render: function () {
		var children = this.props.tags.map(function (tag) {
			return <Tag key={"tag-" + tag.id} tag={tag}/>;
		});

		return (
			<ul className="tags col-md-6">
				{children}
			</ul>
		);
	}
});