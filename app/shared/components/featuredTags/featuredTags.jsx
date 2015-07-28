import React from 'react';
import {Col} from 'react-bootstrap';

import createHash from 'create-hash';
import TagStage from './tag.jsx';
import TagBgStage from './bgTag.jsx';
import {Loader} from '../helper';

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
		if (this.props.sprite) {
			return this.props.featuredTags.map((tag, i) => {
				let size = tagPattern[i % tagPattern.length];
				return (
					<TagBgStage key={"ftag-" + i} tag={tag} size={size} image={"/sprites/" + this.props.sprite.f}
							  width={this.props.sprite.i[i].w} height={this.props.sprite.i[i].h}
							  x={this.props.sprite.i[i].x} y={this.props.sprite.i[i].y}
						/>
				);
			});
		} else if (this.props.sprite === null) {
			return (
				<Loader />
			);
		} else {
			return this.props.featuredTags.map((tag, i) => {
				let size = tagPattern[i % tagPattern.length];
				return (
					<TagStage key={"ftag-" + i} tag={tag} size={size} imageSize={this.props.size}/>
				);
			});
		}
	},

	componentDidMount() {
		this.props.flux.actions.loadSpriteInfo(this.calcHash());
	},

	componentDidUpdate() {
		if(this.props.sprite === undefined) {
			setTimeout(function() {
				this.props.flux.actions.requestSpriting(this.props.featuredTags.map((tag) => tag.image));
			}.bind(this), 0);
		}
	},

	calcHash() {
		var hashSum = createHash("md5");

		this.props.featuredTags.forEach(function (tag) {
			hashSum.update(tag.image, "utf8");
		});

		return hashSum.digest('hex').slice(0, 10);
	}
});
