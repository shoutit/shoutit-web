import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import stringify from 'json-stable-stringify';
import { push, replace } from 'react-router-redux';

import { searchShouts } from '../actions/search';

import Page from '../layout/Page';

import Scrollable from '../ui/Scrollable';
import Progress from '../ui/Progress';
import UIMessage from '../ui/UIMessage';

import ShoutsList from '../shouts/ShoutsList';
import SuggestedShout from '../shouts/SuggestedShout';
import SuggestedInterests from '../interests/SuggestedInterests';
import SuggestedProfiles from '../users/SuggestedProfiles';

import SearchFilters from '../search/SearchFilters';

const getSearchParams = ({ params, query = {}, currentLocation = {} }) => {
  // TODO: this should go into an external module
  let searchParams = {};
  const { shout_type, category } = params;
  const { min_price, max_price, country, state, city, search, filters: qsFilters } = query;

  // Set city, state, country
  if (city && country && state) {
    searchParams.city = decodeURIComponent(city);
    searchParams.state = decodeURIComponent(state);
    searchParams.country = decodeURIComponent(country);
  } else if (currentLocation && currentLocation.country) {
    searchParams.country = currentLocation.country;
    if (currentLocation.state) {
      searchParams.state = currentLocation.state;
    }
    if (currentLocation.city) {
      searchParams.city = currentLocation.city;
    }
  }

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
  searchParams = {
    ...searchParams,
    shout_type,
    category,
    filters: Object.keys(filters).length === 0 ? undefined : filters,
    search: search ? decodeURIComponent(search) : undefined,
    min_price: min_price ? parseInt(min_price, 10) : undefined,
    max_price: max_price ? parseInt(max_price, 10) : undefined,
  };
  return searchParams;
};

const fetchData = (store, params, query) => {
  const { currentLocation } = store.getState();
  const searchParams = getSearchParams({ currentLocation, params, query });
  const promise = store.dispatch(searchShouts(searchParams));
  return promise;
};

export class Search extends Component {

  static propTypes = {
    shouts: PropTypes.array,
    searchString: PropTypes.string,
    nextUrl: PropTypes.string,
    searchParams: PropTypes.object,
  };

  static fetchData = fetchData;

  componentDidMount() {
    const { firstRender, dispatch, searchParams, shouts } = this.props;
    if (!firstRender) {
      if (shouts.length === 0) {
        dispatch(searchShouts(searchParams));
      }
    }
  }

  componentWillUpdate(nextProps) {
    const { searchString, dispatch, currentLocation, location: { query, pathname } } = this.props;
    if (nextProps.searchString !== searchString) {
      dispatch(searchShouts(nextProps.searchParams));
    }
    const { country, state, city } = nextProps.currentLocation;
    if (
      country !== currentLocation.country ||
      state !== currentLocation.state ||
      city !== currentLocation.city
    ) {
      const qs = {
        ...query,
        country, state, city: encodeURIComponent(city),
      };
      const search = Object.keys(qs).map(k => `${k}=${qs[k]}`).join('&');
      const url = `${pathname}?${search}`;
      dispatch(replace(url));
    }
  }

  handleFilterSubmit(searchParams) {
    const { dispatch, searchParams: { city, state, country } } = this.props;
    const { shout_type, category, min_price, max_price, search, filters } = searchParams;
    let url = '/search';
    const query = [];

    // TODO: this should go into an external module
    if (shout_type !== 'all' || (category && category !== 'all')) {
      url += `/${shout_type}`;
    }
    if (category !== 'all') {
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
    const qsFilters = [];
    Object.keys(filters).forEach(slug =>
      qsFilters.push(`${slug}:${filters[slug]}`)
    );

    if (qsFilters.length > 0) {
      query.push(`filters=${qsFilters.join(';')}`);
    }

    if (query.length > 0) {
      url += `?${query.join('&')}`;
    }

    dispatch(push(url));
  }

  render() {
    const { shouts, nextUrl, isFetching, dispatch, error, searchParams } = this.props;

    return (
      <Scrollable
        scrollElement={ () => window }
        onScrollBottom={ () => {
          if (nextUrl && !isFetching) {
            dispatch(searchShouts(searchParams, nextUrl));
          }
        }}
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
          endColumn={ [<SuggestedInterests />,
          <SuggestedProfiles />,
          <SuggestedShout />] }
        >
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
  const { params, location: { query } } = ownProps;
  const searchParams = getSearchParams({ currentLocation, query, params });
  const searchString = stringify(searchParams);
  let isFetching = false;
  let nextUrl;
  let error;
  let shouts = [];
  if (shoutsBySearch[searchString]) {
    isFetching = shoutsBySearch[searchString].isFetching;
    nextUrl = shoutsBySearch[searchString].nextUrl;
    error = shoutsBySearch[searchString].error;
    shouts = shoutsBySearch[searchString].ids.map(id => entities.shouts[id]);
  }
  return {
    searchString,
    searchParams,
    shouts,
    nextUrl,
    isFetching,
    error,
    currentLocation,
    location: ownProps.location,
  };
};

export default connect(mapStateToProps)(Search);
