import React from 'react';
import {State,Navigation} from 'react-router';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';

import SearchForm from './searchForm.jsx';
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
					<SearchForm {...this.state} />
					<SearchResults {...this.state}
						flux={this.getFlux()}
						onTermChange={this.onTermChange}
						onSubmit={this.onSubmit}/>
				</div>
			</DocumentTitle>
		);
	},

	onSubmit(){
	},

	onTermChange(ev) {
		let searchParams = {},
			searchQueries = {};

		searchParams.term = this.state.term;
		searchParams.category = this.state.category;
		searchParams.shouttype = this.state.shouttype;
		searchQueries.min = this.state.min;
		searchQueries.max = this.state.max;
		searchQueries.tags = this.state.tags;

		if(ev.target) {
			switch(ev.target.name) {
			case "term":
				searchParams.term = ev.target.value;
				break;
			case "category":
				searchParams.category = ev.target.value;
				break;
			case "shouttype":
				searchParams.shouttype = ev.target.value;
				break;
			case "min":
				searchQueries.min = ev.target.value;
				break;
			case "max":
				searchQueries.max = ev.target.value;
				break;
			}
		} else { // tags changed
			searchQueries.tags = ev.tags;
		}

		this.setState({
			term: searchParams.term,
			category: searchParams.category,
			shouttype: searchParams.shouttype,
			min: searchQueries.min,
			max: searchQueries.max,
			tags:searchQueries.tags
		});
		
		//search.term.length >= 3? this.updateSearch(search):undefined;
		this.updateSearch(searchParams, searchQueries);
	},

	updateSearch(params, queries) {
		//console.log(search);

		this.replaceWith("search", params, queries);
		this.getFlux().actions.searchAll(assign(params, queries));
	}
});
