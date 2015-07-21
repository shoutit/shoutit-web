import React from 'react';
import Tag from './tag.jsx';

export default React.createClass({
	displayName: "TagList",

	getDefaultProps() {
		return {
			tags: []
		};
	},

	render() {
		let children = this.props.tags.slice(0, 2).map(function (tag) {
			return <Tag key={"tag-" + tag.id} tag={tag}/>;
		});

		return (
			<ul className="tags col-md-9">
				{children}
			</ul>
		);
	}
});
