import React from 'react';
import {History} from 'react-router';
import SearchCardFilters from './searchCardFilters.jsx';
import {StoreWatchMixin} from 'fluxxor';
import {Link} from 'react-router';
import assign from 'lodash/object/assign';

export default React.createClass({
    displayName: "SearchCard",
    mixins: [StoreWatchMixin('users'), History],

    contextTypes: {
        flux: React.PropTypes.object,
        params: React.PropTypes.object,
        location: React.PropTypes.object
    },

    getInitialState(){
        let params = this.context.params;
        let queries = this.context.location.query;

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

    getStateFromFlux() {
        let flux = this.context.flux;

        return {
            users: flux.store('users').getState().users,
            user: flux.store('users').getState().user,
            search: flux.store("search").getState(),
            locations: flux.store("locations").getState()
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
        let location = this.state.locations;
        if(location.current) {
            location.current.city? 
                searchQueries.city = encodeURIComponent(location.current.city): undefined;
            location.current.country? 
                searchQueries.country = encodeURIComponent(location.current.country): undefined;
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
        this.context.flux.actions.searchShouts(assign(params, queries));
    },

    render() {
        let isSearchPage = this.context.params.shouttype;

        if( isSearchPage ) {
            return (
                <section className="si-card gray-card search-card">
                    <SearchCardFilters {...this.state} onSubmit={this.onSubmit}/>
                </section>
            );
        }

        return null;
    }
});
