import React from 'react';
import {Col} from 'react-bootstrap';

import TagStage from './tag.jsx';

const tagPattern = [
	4, 4, 4,
	4, 4, 4,
	4, 4, 4,
	6, 6,
	6, 6
];

export default React.createClass({
	displayName: "FeaturedTags",

	propTypes: {
		featuredTags: React.PropTypes.array.isRequired
	},

	getDefaultProps() {
		return {
			size: "medium"
		};
	},

	render() {
		return (
			<Col md={12} xs={12}>
				{this.renderTags()}
			</Col>
		);
	},

	renderTags() {
		return this.props.featuredTags.map((tag, i) => {
			let size = tagPattern[i % tagPattern.length];
			return (
				<TagStage key={"ftag-" + i} tag={tag} size={size} imageSize={this.props.size}/>
			);
		});
	}
});
