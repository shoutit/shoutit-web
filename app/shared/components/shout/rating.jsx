import React from 'react';
import {Icon} from '../helper';

export default React.createClass({
	displayName: "Rating",

	getDefaultProps() {
		return {
			max: 5,
			rating: 3
		};
	},

	renderStars() {
		let filled = Math.floor(this.props.rating),
			stars = [];
		for (let i = 0; i < this.props.max; i++) {
			if (i < filled) {
				stars.push(<Icon name="start-1"/>);
			} else {
				stars.push(<Icon name="b1"/>);
			}
		}
	},

	render() {
		return (
			<div className="dot2">
				{this.renderStars()}
			</div>
		);
	}
});
