import React from 'react';
import {State} from 'react-router';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';

import FeaturedTags from './featuredTags.jsx';

export default React.createClass({
	displayName: "FeaturedTagsContainer",
	mixins: [new FluxMixin(React), new StoreWatchMixin('tags'), State],

	statics: {
		fetchData(client, session, params) {
			return client.tags().list(session, {
				type: "featured",
				page_size: 52,
				city: params.city === "all" ? null : params.city,
				country: params.country === "all" ? null : params.country,
				state: params.state === "all" ? null : params.state
			});
		}
	},

	getStateFromFlux() {
		let storeState = this.getFlux().store('tags').getState();
		return {
			featuredTags: storeState.featuredTags || null
		};
	},

	render(){
		return this.state.featuredTags ? (
			<FeaturedTags {...this.props} featuredTags={this.state.featuredTags}/>
		) : null;
	},

	componentDidMount() {
		if (!this.state.featuredTags) {
			let params = this.getParams();

			this.getFlux().actions.loadTags({
				country: params.country,
				city: params.city,
				state: params.state,
				type: "featured",
				page_size: 52
			});
		}
	},

	shouldComponentUpdate(nextProps, nextState) {
		return nextState.featuredTags &&
			( (!this.state.featuredTags) || (this.state.featuredTags.length !== nextState.featuredTags.length));
	}
});
