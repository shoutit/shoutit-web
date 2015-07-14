import React from 'react';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';
import {Link} from 'react-router';

import {Col} from 'react-bootstrap';

const sizePattern = [
	34, 30, 26, 25, 24, 22, 22, 22, 20, 20, 20, 18, 16
];

export default React.createClass({
	displayName: "TagCloud",
	mixins: [new FluxMixin(React), new StoreWatchMixin('tags')],

	contextTypes: {
		router: React.PropTypes.func
	},


	getStateFromFlux() {
		return this.getFlux().store('tags').getState();
	},

	render() {
		return (
			<Col xs={12} md={12} className="activities">
				<h4>Featured Tags</h4>

				<div className="tags">
					{this.renderTags()}
				</div>
			</Col>
		);
	},

	renderTags() {
		if (this.state.featuredTags && this.state.featuredTags.length) {
			let left = true,
				renderedTags = [];

			this.state.featuredTags.forEach((tag, i) => {
				let size = sizePattern[i % sizePattern.length];
				let renderedTag = (
					<Link key={"tagCloud-" + i} to="tag" params={{tagName: tag.name}}>
						<span className={"tag" + size}>{tag.title}</span>
					</Link>
				);

				if (left) {
					renderedTags.splice(0, 0, renderedTag);
				} else {
					renderedTags.push(renderedTag);
				}

				left = !left;
			});

			return renderedTags;
		} else {
			return (<h4>No tags loaded!</h4>);
		}
	},

	componentDidMount() {
		if (!this.state.featuredTags) {
			let params = this.context.router.getCurrentParams();

			this.getFlux().actions.loadTags({
				country: params.country,
				city: params.city,
				state: params.state,
				type: "featured",
				page_size: 13
			});
		}
	}
});
