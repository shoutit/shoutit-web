import React from 'react';
import {History} from 'react-router';
import SearchShoutList from './searchShoutList.jsx';
import SearchTagsList from './searchTagsList.jsx';
import DocumentTitle from 'react-document-title';

export default React.createClass({
  mixins: [History],
  displayName: "Search",

  childContextTypes: {
    flux: React.PropTypes.object,
    params: React.PropTypes.object
  },

  getChildContext() {
    return {
      flux: this.props.flux,
      params: this.props.params
    }
  },

  getInitialState(){
    let params = this.props.params;
    let queries = this.props.location.search;

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
    const { currentLocation } = this.props;
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
    this.history.replaceWith(path, queries);
    this.props.flux.actions.searchShouts(assign(params, queries));
  },

  render() {
    return (
      <DocumentTitle title={"Shoutit Search - " + this.state.term}>
        <div>
          {/*<SearchTagsList { ...this.state } { ...this.props }/>*/}
          <SearchShoutList { ...this.state } { ...this.props }/>
        </div>
      </DocumentTitle>
    );
  }
});
//<SearchFilters {...this.state} onSubmit={this.onSubmit}/>
