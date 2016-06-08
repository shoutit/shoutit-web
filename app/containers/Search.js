import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';

import { push } from 'react-router-redux';
import Helmet from '../utils/Helmet';
import { getLocationPath } from '../utils/LocationUtils';
import { getPaginationState, getShouts, getCategory } from '../selectors';
import { getSearchParamsFromQuery, getQuerystringFromSearchParams } from '../utils/SearchUtils';

import { loadShouts, invalidateShouts } from '../actions/shouts';

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
  dispatch(invalidateShouts(searchParams));
  return dispatch(loadShouts(state.currentLocation, searchParams));
};

const MESSAGES = defineMessages({
  title: {
    id: 'search.page.title',
    defaultMessage: 'Search Shouts',
  },
  titleWithCategory: {
    id: 'search.page.title.with-category',
    defaultMessage: 'Search {category}',
  },
  titleWithCity: {
    id: 'search.page.title.with-city',
    defaultMessage: 'Search Shouts in {city}',
  },
  titleWithCityAndCategory: {
    id: 'search.page.title.with-city-and-category',
    defaultMessage: 'Search {category} in {city}',
  },
  errorTitle: {
    id: 'search.shouts.error.title',
    defaultMessage: 'There was an error',
  },
  errorDetails: {
    id: 'search.shouts.error.details',
    defaultMessage: 'Cannot load shouts right now. Please try again.',
  },
  notFoundTitle: {
    id: 'search.shouts.notFound.title',
    defaultMessage: 'Nothing found',
  },
  notFoundDetails: {
    id: 'search.shouts.notFound.details',
    defaultMessage: 'There are no Shouts for this search. Please refine your filters.',
  },
});

export class Search extends Component {

  static propTypes = {
    currentUrl: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
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
    const { formatMessage } = this.props.intl;
    return (
      <Scrollable
        scrollElement={ () => window }
        onScrollBottom={ () => {
          if (nextUrl && !isFetching) {
            dispatch(loadShouts(currentLocation, searchParams, nextUrl));
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

          <Progress animate={ isFetching } />

          { !isFetching && error &&
            <UIMessage
              title={ formatMessage(MESSAGES.errorTitle) }
              details={ formatMessage(MESSAGES.errorDetails) }
              type="error"
              retryAction={ () => dispatch(loadShouts(currentLocation, searchParams, nextUrl)) }
            />
          }

          { !isFetching && !error && shouts.length === 0 &&
            <UIMessage
              title={ formatMessage(MESSAGES.notFoundTitle) }
              details={ formatMessage(MESSAGES.notFoundDetails) }
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
  let title;

  if (searchParams.category) {
    const category = getCategory(state, searchParams.category).name;
    if (currentLocation && currentLocation.city) {
      title = ownProps.intl.formatMessage(MESSAGES.titleWithCityAndCategory, {
        city: currentLocation.city,
        category,
      });
    } else {
      title = ownProps.intl.formatMessage(MESSAGES.titleWithCategory, {
        category,
      });
    }
  } else {
    if (currentLocation && currentLocation.city) {
      title = ownProps.intl.formatMessage(MESSAGES.titleWithCity, {
        city: currentLocation.city,
      });
    } else {
      title = ownProps.intl.formatMessage(MESSAGES.title);
    }
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

export default injectIntl(connect(mapStateToProps)(Search));
