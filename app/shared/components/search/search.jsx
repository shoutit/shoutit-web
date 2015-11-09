import React from 'react';
import {State,Navigation} from 'react-router';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';

import SearchFilters from './searchFilters.jsx';
import SearchResults from './searchResults.jsx';
import DocumentTitle from 'react-document-title';

import {assign} from 'object-assign';

export default React.createClass({
	mixins: [new FluxMixin(React), new StoreWatchMixin("search"), State, Navigation],
	displayName: "Search",

	getInitialState(){
		let params = this.getParams();
		let queries = this.getQuery();

		return {
			term: params.term || "",
			shouttype: params.shouttype || "",
			category: params.category || "",
			min: queries.min || null,
			max: queries.max || null,
			tags: queries.tags || "",
			city: queries.city || undefined,
			country: queries.country || undefined
		};
	},

	getStateFromFlux(){
		return {
			search: this.getFlux().store("search").getState(),
			locations: this.getFlux().store("locations").getState()
		};

	},

	render(){
		return (
			<DocumentTitle title={"Shoutit Search - " + this.state.term}>
				<div className="profile">
					<SearchFilters {...this.state} onSubmit={this.onSubmit}/>
					<SearchResults {...this.state} flux={this.getFlux()}/>
				</div>
			</DocumentTitle>
		);
	},

	onSubmit(filters){
		let searchParams = {},
			searchQueries = {};

		// Departing URL params from queries
		searchParams.term = filters.term;
		searchParams.category = filters.category;
		searchParams.shouttype = filters.shouttype;

		filters.min? 
			searchQueries.min = filters.min: undefined;
		filters.max?
			searchQueries.max = filters.max: undefined;
		filters.tags?
			searchQueries.tags = filters.tags: undefined;

		// setting location if available
		let location = this.state.locations;
		if(location.current) {
			location.current.city? 
				searchQueries.city = encodeURIComponent(location.current.city): undefined;
			location.current.country? 
				searchQueries.country = encodeURIComponent(location.current.country): undefined;
		}


		this.updateSearch(searchParams, searchQueries);
	},

	updateSearch(params, queries) {
		this.replaceWith("search", params, queries);
		this.getFlux().actions.searchShouts(assign(params, queries));
	}
});
