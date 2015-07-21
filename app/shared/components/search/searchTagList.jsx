import React from 'react';
import {Loader} from '../helper';

import Tag from '../feed/feed/shout/tag.jsx';

export default React.createClass({
	displayName: "SearchTagList",

	componentDidMount() {
		let term = this.props.term,
			tags = this.props.search.tags[term];

		if (!tags) {
			this.props.flux.actions.searchTags(term);
		}
	},

	renderTags(tags) {
		return tags.length ? tags.map(function (tag, i) {
			return <Tag key={"tag-" + i} tag={tag} index={i}/>;
		}) : <h4>No tags.</h4>;
	},

	render() {
		let term = this.props.term,
			tags = this.props.search.tags[term],
			content;

		if (tags) {
			content = this.renderTags(tags);
		} else {
			content = <Loader/>;
		}

		return (
			<div className="listener-scroll ctn-offerpro" tabIndex="5000"
				 style={{outline: "none"}}>
				<ul className="tags col-md-12">
					{content}
				</ul>
			</div>
		);
	}
});