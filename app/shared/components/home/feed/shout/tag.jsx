var React = require('react'),
	Link = require('react-router').Link;

var Icon = require('../../../helper/icon.jsx');

module.exports = React.createClass({
	displayName: "Tag",

	render: function () {
		var tag = this.props.tag;

		return (
			<li key={this.props.key}>
				<Link to="tag" params={{tagId: tag.id, tagName: encodeURIComponent(tag.name)}}>
					<Icon name="tag"/>
					{tag.name}
				</Link>
			</li>
		);

	}
});