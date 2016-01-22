import React from 'react';
import {StoreWatchMixin} from 'fluxxor';
import FeaturedTags from './featuredTags.jsx';

export default React.createClass({
	displayName: "FeaturedTagsContainer",
	mixins: [new StoreWatchMixin('tags')],

	statics: {
		fetchId: 'tags',
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
		let storeState = this.props.flux.store('tags').getState();
		return {
			featuredTags: storeState.featuredTags || null,
			sprite: storeState.sprite
		};
	},

	render(){
		return this.state.featuredTags ? (
			<FeaturedTags {...this.props}
				flux={this.props.flux}
				featuredTags={this.state.featuredTags}
				sprite={this.state.sprite}/>
		) : null;
	},

	componentDidMount() {
		if (!this.state.featuredTags) {
			let params = this.props.params;

			this.props.flux.actions.loadTags({
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
			( (!this.state.featuredTags) || (this.state.featuredTags.length !== nextState.featuredTags.length) || (this.state.sprite !== nextState.sprite));
	}
});
