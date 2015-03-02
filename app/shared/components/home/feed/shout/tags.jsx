var React = require('react'),
	Link = require('react-router').Link;

module.exports = React.createClass({
	displayName: "TagList",

	getDefaultProps: function () {
		return {
			tags: []
		};
	},

	render: function () {
		var children = this.props.tags.map(function (tag) {
			return (
				<li key={"tag-" + tag.id}>
					<Link to="tag" params={{tagId: tag.id, tagName: tag.name}}>
					{tag.name}
					</Link>
				</li>
			);
		});

		return (
			<ul className="tags col-md-6">
				{children}
			</ul>
		);
	}
});