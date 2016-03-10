import React from "react";
import SearchCardFilters from "./searchCardFilters.jsx";
import { StoreWatchMixin } from "fluxxor";
import { Link, History } from "react-router";

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
    const { flux } = this.props;

    return {
      users: flux.store('users').getState().users,
      user: flux.store('users').getState().user,
      search: flux.store("search").getState()
    }
  },

  onSubmit(filters) {
    const searchParams = {};
    const searchQueries = {};
    const { searchKeyword, flux, currentLocation } = this.props;

    // Departing URL params from queries
    searchParams.category = filters.category;
    searchParams.shouttype = filters.shouttype;
    searchParams.term = searchKeyword;

    filters.min ?
      searchQueries.min = filters.min : undefined;
    filters.max ?
      searchQueries.max = filters.max : undefined;
    filters.tags ?
      searchQueries.tags = filters.tags : undefined;

    // setting location if available
    if (currentLocation) {
      currentLocation.city ?
        searchQueries.city = currentLocation.city : undefined;
      currentLocation.country ?
        searchQueries.country = currentLocation.country : undefined;
    }

    // create url path (new react router path style)
    let urlPath = `/search/${searchParams.shouttype}/${searchParams.category}`;
    if (searchParams.term) {
      urlPath = `${urlPath}/${searchParams.term}`;
    }

    const { history } = this;

    history.replaceState(null, urlPath, searchQueries);
    flux.actions.searchShouts({ ...searchParams, ...searchQueries });
  },

  render() {
    return (
      <section className="si-card gray-card search-card">
        <SearchCardFilters {...this.state} onSubmit={this.onSubmit}/>
      </section>
    );
  }
});
