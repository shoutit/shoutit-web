import React from 'react';
import {State,Navigation} from 'react-router';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';

import SearchFilters from './searchFilters.jsx';
import SearchResults from './searchResults.jsx';
import DocumentTitle from 'react-document-title';

import assign from 'core-js/modules/$.assign.js';

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
			tags: queries.tags || ""
		};
	},

	getStateFromFlux(){
		return {
			search: this.getFlux().store("search").getState()
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

		searchQueries.min = filters.min;
		searchQueries.max = filters.max;
		searchQueries.tags = filters.tags;

		this.updateSearch(searchParams, searchQueries);
	},

	updateSearch(params, queries) {
		this.replaceWith("search", params, queries);
		this.getFlux().actions.searchShouts(assign(params, queries));
	}
});
