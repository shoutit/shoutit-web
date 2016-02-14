import React from 'react';
import {History} from 'react-router';
import SearchCardFilters from './searchCardFilters.jsx';
import {StoreWatchMixin} from 'fluxxor';
import {Link} from 'react-router';
import assign from 'lodash/object/assign';

export default React.createClass({
    displayName: "SearchCard",
    mixins: [StoreWatchMixin('users'), History],

    getInitialState(){
        const { params } = this.props;
        const { query } = this.props.location;

        return {
            term: params.term || "",
            shouttype: params.shouttype || "",
            category: params.category || "",
            min: query.min || null,
            max: query.max || null,
            tags: query.tags || "",
            city: query.city || undefined,
            country: query.country || undefined
        };
    },

    getStateFromFlux() {
        const {flux} = this.props;

        return {
            users: flux.store('users').getState().users,
            user: flux.store('users').getState().user,
            search: flux.store("search").getState()
        }
    },

    onSubmit(filters){
        let searchParams = {},
            searchQueries = {};

        // Departing URL params from queries
        searchParams.category = filters.category;
        searchParams.shouttype = filters.shouttype;

        filters.min?
            searchQueries.min = filters.min: undefined;
        filters.max?
            searchQueries.max = filters.max: undefined;
        filters.tags?
            searchQueries.tags = filters.tags: undefined;

        // setting location if available
        const {currentLocation} = this.props;
        if(currentLocation) {
          currentLocation.city?
                searchQueries.city = encodeURIComponent(currentLocation.city): undefined;
          currentLocation.country?
                searchQueries.country = encodeURIComponent(currentLocation.country): undefined;
        }

        // create url path (new react router path style)
        let urlPath = `/search/${searchParams.shouttype}/${searchParams.category}`;
        if(searchParams.term) {
            urlPath = `${urlPath}/${searchParams.term}`;
        }

        this.updateSearch(searchParams, searchQueries, urlPath);
    },

    updateSearch(params, queries, path) {
        this.history.replaceState(null, path, queries);
        this.props.flux.actions.searchShouts(assign(params, queries));
    },

    render() {
        return (
            <section className="si-card gray-card search-card">
                <SearchCardFilters {...this.state} onSubmit={this.onSubmit}/>
            </section>
        );
    }
});
