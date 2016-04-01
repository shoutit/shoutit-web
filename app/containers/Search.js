import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import stringify from 'json-stable-stringify';

import { searchShouts } from '../actions/search';

import ShoutsList from '../shouts/ShoutsList';

const getSearchParams = ({ params, query, currentLocation }) => {
  const searchParams = {};

  if (query.city && query.country) {
    searchParams.city = decodeURIComponent(query.city);
    searchParams.country = decodeURIComponent(query.country);
  } else if (currentLocation.country) {
    searchParams.country = currentLocation.country;
    if (currentLocation.city) {
      searchParams.city = currentLocation.city;
    }
  }

  if (params.shoutType) {
    searchParams.shout_type = params.shoutType;
  }
  if (params.category) {
    searchParams.category = params.category;
  }
  return searchParams;
};

const fetchData = (store, params, query) => {
  const { currentLocation } = store.getState();
  const searchParams = getSearchParams({ currentLocation, params, query });
  return store.dispatch(searchShouts(searchParams));
};

export class Search extends Component {

  static propTypes = {
    shouts: PropTypes.array,
    searchString: PropTypes.string,
    nextUrl: PropTypes.string,
    searchParams: PropTypes.array,
  };

  static fetchData = fetchData;

  componentDidMount() {
    const { firstRender, dispatch } = this.props;
    if (!firstRender) {
      dispatch(searchShouts(this.props.searchParams));
    }
  }

  componentWillUpdate(nextProps) {
    const { searchString, dispatch } = this.props;
    if (nextProps.searchString !== searchString) {
      dispatch(searchShouts(nextProps.searchParams));
    }
  }

  render() {
    const { isFetching, shouts } = this.props;
    return (
      <div>
        Search
        { isFetching && <p>Loading...</p> }
        <ShoutsList shouts={ shouts } />
      </div>

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
  let shouts = [];
  if (shoutsBySearch[searchString]) {
    isFetching = shoutsBySearch[searchString].isFetching;
    nextUrl = shoutsBySearch[searchString].nextUrl;
    shouts = shoutsBySearch[searchString].ids.map(id => entities.shouts[id]);
  }

  return {
    searchString,
    searchParams,
    shouts,
    nextUrl,
    isFetching,
  };
};

export default connect(mapStateToProps)(Search);
