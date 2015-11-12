import React from 'react';
import {History} from 'react-router';
import {StoreWatchMixin} from 'fluxxor';
import {Input} from 'react-bootstrap';

import Search from './search.jsx';
import SearchResultList from './search/searchResultList.jsx';
import assign from 'lodash/object/assign';

export default React.createClass({
	mixins: [new StoreWatchMixin("search", "locations"), History],

	displayName: "SearchBar",

	getStateFromFlux() {
		let flux = this.props.flux;
		return {
			search: flux.store("search").getState(),
			users: flux.store("users").getState(),
			locations: flux.store('locations').getState()
		};
	},

	getInitialState() {
		return {
			showSearch: 0,
			term: "",
			locTerm: ""
		};
	},

	renderSearchList() {
		let term = this.state.term,
			search = this.state.search;

		if(term) {
			return (<SearchResultList
				results={{
	                users: search.users,
	                shouts: search.shouts,
	                tags: search.tags
	            }}
				params={{term, category: 'all', shouttype: 'all'}}
				onBlur={this.onBlurSearch}
				/>);
		}
	},

	renderLocationList() {
		let placePredictions = this.state.locations.locations[this.state.locTerm];

		let placesList = placePredictions && placePredictions.length ?
				<div>
					<div className="list-search-title">Results</div>
					{placePredictions.map((prediction, i) => (
						<div className="list-search-loc" onClick={this.onLocationSelect(prediction)} key={"prediction" + i}>
							{prediction.description}
						</div>
					))}
				</div>
			 		: null;

		return (<div className="list-search">
					<div className="list-search-title">Select your Location</div>
						<Input
							id="locationSearch"
							ref="locationInput"
							type="text"
							placeholder="Search"
							onChange={this.onLocInputChange}
							value={this.state.locTerm}
							/>
				{placesList}
		</div>);

	},

	renderList() {
		switch (this.state.showSearch) {
			case 1:
				return this.renderSearchList();
			case 2:
				return this.renderLocationList();
			default:
				return null;
		}
	},

	render() {
		return (
			<div className="search-bar">
				<Search
					flux={this.props.flux}
					onFocus={this.onFocusSearch}
					onChangeSearch={this.onChangeSearch}
					onSubmit={this.onSubmit}
					onBlur={this.onBlurSearch}
					term={this.state.term}
					/>
				{this.renderList()}
			</div>
		);
	},

	onFocusSearch(type) {
		return function () {
			this.setState({showSearch: type});
		}.bind(this);
	},

	onBlurSearch() {
		this.setState({showSearch: false});
	},

	onChangeSearch(ev) {
		let newTerm = ev.target.value;
		this.setState({term: newTerm});
		this.searchAll(newTerm);
	},

	onSubmit() {
		this.setState({showSearch: false});
		this.searchAll(this.state.term, true);
	},

	searchAll(term, moveToSearchPage=false) {
		let searchReq = {};
		let searchQuery = {};

		searchReq.term = term;
		// setting location if available
		let location = this.state.locations;
		if(location.current) {
			location.current.city? 
				searchQuery.city = location.current.city: undefined;
			location.current.country? 
				searchQuery.country = location.current.country: undefined;
		}

		// no category and shout selection in main page
		searchReq.shouttype = 'all';
		searchReq.category = 'all';

		// send search action
		this.props.flux.actions.searchAll(assign(searchReq,searchQuery));
		// move to search page if requested
		if (moveToSearchPage) {
			searchReq.term = encodeURIComponent(searchReq.term);
			searchQuery.city = encodeURIComponent(searchQuery.city);
			searchQuery.country = encodeURIComponent(searchQuery.country);
			this.history.pushState(null, 
				`/search/${searchReq.shouttype}/${searchReq.category}/${searchReq.term}`, searchQuery);
		}
	},

	onLocInputChange(ev) {
		let newTerm = ev.target.value;
		this.setState({locTerm: newTerm});
		this.props.flux.actions.loadPredictions(newTerm);
	},

	onLocationSelect(prediction) {
		return function () {
			this.setState({showSearch: false});
			this.props.flux.actions.selectLocation(prediction);
		}.bind(this);
	}
});
