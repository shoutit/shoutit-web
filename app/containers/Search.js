import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import stringify from 'json-stable-stringify';
import isEqual from 'lodash/lang/isEqual';

import { push, replace } from 'react-router-redux';
import Helmet from '../utils/Helmet';

import { searchShouts, invalidateShoutsSearch } from '../actions/search';

import { denormalize } from '../schemas';

import Page from '../layout/Page';

import Scrollable from '../ui/Scrollable';
import Progress from '../ui/Progress';
import UIMessage from '../ui/UIMessage';

import ShoutsList from '../shouts/ShoutsList';
import SuggestedShout from '../shouts/SuggestedShout';
import SuggestedTags from '../tags/SuggestedTags';
import SuggestedProfiles from '../users/SuggestedProfiles';

import SearchFilters from '../search/SearchFilters';

const getSearchParamsFromRoute = (params, query) => {

  const { shout_type, category } = params;
  const { min_price, max_price, search, filters: qsFilters } = query;

  let filters = {};
  if (qsFilters) {
    qsFilters.split(';').forEach(qsFilter => {
      const filter = qsFilter.split(':');
      if (filter.length === 2) {
        filters = {
          ...filters,
          [filter[0]]: filter[1],
        };
      }
    });
  }
  const searchParams = {
    shout_type,
    category,
    filters: Object.keys(filters).length === 0 ? undefined : filters,
    search: search ? decodeURIComponent(search) : undefined,
    min_price: min_price ? parseInt(min_price, 10) : undefined,
    max_price: max_price ? parseInt(max_price, 10) : undefined,
  };
  return searchParams;
};

function getRoutePath(currentLocation, searchParams) {
  const { country, state, city } = currentLocation;
  const { shout_type, category, min_price, max_price, search, filters } = searchParams;
  let url = '/search';
  const query = [];

  if (shout_type) {
    url += `/${shout_type}`;
  } else if (category) {
    url += '/all';
  }
  if (category) {
    url += `/${category}`;
  }

  if (country) {
    query.push(`country=${country}`);
  }
  if (state) {
    query.push(`state=${state}`);
  }
  if (city) {
    query.push(`city=${city}`);
  }
  if (search) {
    query.push(`search=${encodeURIComponent(search)}`);
  }
  if (min_price) {
    query.push(`min_price=${min_price}`);
  }
  if (max_price) {
    query.push(`max_price=${max_price}`);
  }

  if (filters) {
    const qsFilters = [];
    Object.keys(filters).forEach(slug =>
      qsFilters.push(`${slug}:${filters[slug]}`)
    );
    if (qsFilters.length > 0) {
      query.push(`filters=${qsFilters.join(';')}`);
    }
  }

  if (query.length > 0) {
    url += `?${query.join('&')}`;
  }

  return url;
}

const fetchData = (dispatch, state, params, query) => {
  const searchParams = getSearchParamsFromRoute(params, query);
  dispatch(invalidateShoutsSearch(searchParams));
  return dispatch(searchShouts(searchParams));
};

export class Search extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    currentLocation: PropTypes.object,
    error: PropTypes.object,
    firstRender: PropTypes.bool,
    isFetching: PropTypes.bool,
    nextUrl: PropTypes.string,
    params: PropTypes.object,
    searchParams: PropTypes.object,
    searchString: PropTypes.string,
    shouts: PropTypes.array,
    title: PropTypes.string,
  };

  static fetchData = fetchData;

  componentDidMount() {
    const { firstRender, dispatch, currentLocation, params, location: { query } } = this.props;
    if (!firstRender) {
      const state = { currentLocation };
      fetchData(dispatch, state, params, query);
    }
  }

  componentWillUpdate(nextProps) {

    const { searchString, dispatch, currentLocation } = this.props;
    const state = { currentLocation };
    if (nextProps.searchString !== searchString) {
      fetchData(dispatch, state, nextProps.params, nextProps.location.query);
    }
  }

  componentDidUpdate(prevProps) {
    const { currentLocation, dispatch, searchParams } = this.props;
    if (!isEqual(prevProps.currentLocation, currentLocation)) {
      const url = getRoutePath(currentLocation, searchParams);
      dispatch(replace(url));
    }
  }

  handleFilterSubmit(searchParams) {
    const { dispatch, currentLocation } = this.props;
    const url = getRoutePath(currentLocation, searchParams);
    dispatch(push(url));
  }

  render() {
    const { shouts, nextUrl, isFetching, dispatch, error, searchParams, title } = this.props;

    return (
      <Scrollable
        scrollElement={ () => window }
        onScrollBottom={ () => {
          if (nextUrl && !isFetching) {
            dispatch(searchShouts(searchParams, nextUrl));
          }
        } }
        triggerOffset={ 400 }
      >
        <Page
          className="Search"
          startColumn={
            <div className="Search-start-column">
              <SearchFilters disabled={ false } searchParams={ searchParams } onSubmit={ params => this.handleFilterSubmit(params) } />
            </div>
          }
          stickyStartColumn
          endColumn={ [<SuggestedTags />, <SuggestedProfiles />, <SuggestedShout />] }>

          <Helmet title={ title } />
          <ShoutsList shouts={ shouts } />

          <Progress
            animate={ isFetching }
            label={ shouts.length === 0 ? 'Searching for shouts…' : 'Searching for more shouts…' }
          />

          { !isFetching && error &&
            <UIMessage
              title="There was an error"
              details="Cannot load shouts right now."
              type="error"
              retryAction={ () => dispatch(searchShouts(searchParams, nextUrl)) }
            />
          }

          { !isFetching && !error && shouts.length === 0 &&
            <UIMessage
              title="Nothing found"
              details="There are no shouts for this search. Try with other filters."
            />
          }

        </Page>
      </Scrollable>
    );
  }

}

const mapStateToProps = (state, ownProps) => {
  const { currentLocation, paginated: { shoutsBySearch }, entities } = state;

  const searchParams = getSearchParamsFromRoute(ownProps.params, ownProps.location.query);

  const searchString = stringify(searchParams);

  let isFetching = false;
  let nextUrl;
  let error;
  let shouts = [];

  if (shoutsBySearch[searchString]) {
    isFetching = shoutsBySearch[searchString].isFetching;
    nextUrl = shoutsBySearch[searchString].nextUrl;
    error = shoutsBySearch[searchString].error;
    shouts = shoutsBySearch[searchString].ids.map(id => denormalize(entities.shouts[id], entities, 'SHOUT'));
  }

  let title = 'Search';

  if (searchParams.category) {
    title = ` ${state.entities.categories[searchParams.category].name}`;
  }

  if (searchParams.shout_type && searchParams.shout_type !== 'all') {
    title += ` ${searchParams.shout_type}s`;
  }

  if (searchParams.city) {
    title += ` in ${searchParams.city}`;
  }

  return {
    searchString,
    searchParams,
    shouts,
    nextUrl,
    isFetching,
    error,
    currentLocation,
    title,
    location: ownProps.location,
  };
};

export default connect(mapStateToProps)(Search);
