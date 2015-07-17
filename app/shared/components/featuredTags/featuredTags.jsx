import React from 'react';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';
import {Col, Grid} from 'react-bootstrap';

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
	mixins: [new FluxMixin(React), new StoreWatchMixin('tags')],

	contextTypes: {
		router: React.PropTypes.func
	},

	statics: {
		fetchData(client, session, params) {
			return client.tags().list(session, {
				type: "featured",
				page_size: 13,
				city: params.city === "all" ? null : params.city,
				country: params.country === "all" ? null : params.country,
				state: params.state === "all" ? null : params.state
			});
		}
	},

	getStateFromFlux() {
		return this.getFlux().store('tags').getState();
	},

	render() {
		return (
			<Col md={12} xs={12}>
				{this.renderTags()}
			</Col>
		);
	},

	renderTags() {
		return this.state.featuredTags ? this.state.featuredTags.map((tag, i) => {
			let size = tagPattern[i % tagPattern.length];
			return (
				<TagStage key={"ftag-" + i} tag={tag} size={size}/>
			);
		}) : null;
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
