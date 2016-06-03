import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import { push } from 'react-router-redux';
import Helmet from '../utils/Helmet';
import { getLocationPath } from '../utils/LocationUtils';
import { getPaginationState, getShouts, getCategory } from '../selectors';
import { getSearchParamsFromQuery, getQuerystringFromSearchParams } from '../utils/SearchUtils';

import { searchShouts, invalidateShoutsSearch } from '../actions/search';

import Page from '../layout/Page';

import Scrollable from '../ui/Scrollable';
import Progress from '../ui/Progress';
import UIMessage from '../ui/UIMessage';

import ShoutsList from '../shouts/ShoutsList';
import SuggestedShout from '../shouts/SuggestedShout';
import SuggestedTags from '../tags/SuggestedTags';
import SuggestedProfiles from '../users/SuggestedProfiles';

import SearchFilters from '../search/SearchFilters';

const fetchData = (dispatch, state, params, query) => {
  const searchParams = getSearchParamsFromQuery(query);
  dispatch(invalidateShoutsSearch(searchParams));
  return dispatch(searchShouts(state.currentLocation, searchParams));
};

export class Search extends Component {

  static propTypes = {
    currentUrl: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    currentLocation: PropTypes.object,
    error: PropTypes.object,
    firstRender: PropTypes.bool,
    isFetching: PropTypes.bool,
    nextUrl: PropTypes.string,
    params: PropTypes.object,
    searchParams: PropTypes.object,
    shouts: PropTypes.array,
    title: PropTypes.string,
  };

  static fetchData = fetchData;

  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
  }

  componentDidMount() {
    const { firstRender, dispatch, params, currentLocation, location } = this.props;
    if (!firstRender) {
      fetchData(dispatch, { currentLocation }, params, location.query);
    }
  }

  componentWillUpdate(nextProps) {
    const { currentUrl, dispatch, currentLocation } = this.props;
    const state = { currentLocation };
    if (nextProps.currentUrl !== currentUrl) {
      fetchData(dispatch, state, nextProps.params, nextProps.location.query);
    }
  }

  componentDidUpdate(prevProps) {
    const { currentLocation, searchParams } = this.props;
    if (prevProps.currentLocation.slug !== currentLocation.slug) {
      this.search(searchParams);
    }
  }

  search(searchParams) {
    const { dispatch, currentLocation } = this.props;
    let path = `/search${getLocationPath(currentLocation)}`;
    if (searchParams) {
      const qs = getQuerystringFromSearchParams(searchParams);
      if (qs) {
        path += `?${qs}`;
      }
    }
    dispatch(push(path));
  }

  render() {
    const { shouts, nextUrl, isFetching, dispatch, error, searchParams, currentLocation, title } = this.props;

    return (
      <Scrollable
        scrollElement={ () => window }
        onScrollBottom={ () => {
          if (nextUrl && !isFetching) {
            dispatch(searchShouts(currentLocation, searchParams, nextUrl));
          }
        } }
        triggerOffset={ 400 }
      >
        <Page
          className="Search"
          startColumn={
            <div className="Search-start-column">
              <SearchFilters disabled={ false } searchParams={ searchParams } onSubmit={ this.search } />
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
              retryAction={ () => dispatch(searchShouts(currentLocation, searchParams, nextUrl)) }
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
  const { routing, currentLocation } = state;
  const searchParams = getSearchParamsFromQuery(ownProps.location.query);
  let title = 'Search';

  if (searchParams.category) {
    title = ` ${getCategory(state, searchParams.category).name}`;
  }
  if (searchParams.shout_type && searchParams.shout_type !== 'all') {
    title += ` ${searchParams.shout_type}s`;
  }
  if (searchParams.city) {
    title += ` in ${searchParams.city}`;
  }

  return {
    currentUrl: routing.currentUrl,
    searchParams,
    currentLocation,
    title,
    location: ownProps.location,
    shouts: getShouts(state),
    ...getPaginationState(state, 'shouts'),
  };
};

export default connect(mapStateToProps)(Search);
