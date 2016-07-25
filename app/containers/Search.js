/* eslint-env browser */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';

import { push } from 'react-router-redux';

import Helmet from '../utils/Helmet';
import { Desktop } from '../utils/MediaQueries';

import { getQuery, getCurrentUrl } from '../reducers/routing';
import { getCurrentLocation } from '../reducers/currentLocation';
import { getCategory } from '../reducers/categories';

import { getLocationPath } from '../utils/LocationUtils';
import { getShouts, getShoutsCount, getShoutsPageState, getShoutsQuery } from '../reducers/paginated/shouts';
// import { getCategory } from '../reducers/categories';

import { getSearchQuery, getQuerystringFromSearchParams } from '../utils/SearchUtils';

import { loadShouts } from '../actions/shouts';

import Page, { Body, StartColumn } from '../layout/Page';
import Pagination from '../layout/Pagination';
import ShoutsList from '../shouts/ShoutsList';
import ShoutsListToolbar from '../shouts/ShoutsListToolbar';
import SearchFilters from '../search/SearchFilters';

import './Search.scss';

const PAGE_SIZE = 12;

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

const fetchData = (dispatch, state, params, query) =>
  dispatch(loadShouts({
    sort: 'time',
    ...getSearchQuery(query, getCurrentLocation(state)),
    page_size: PAGE_SIZE,
  }));

export class Search extends Component {

  static propTypes = {
    currentUrl: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    query: PropTypes.object.isRequired,

    currentLocation: PropTypes.object,
    firstRender: PropTypes.bool,
    params: PropTypes.object,
    shouts: PropTypes.array,
    count: PropTypes.number,
    isFetching: PropTypes.bool,

    route: PropTypes.shape({
      url: PropTypes.string.isRequired,
      query: PropTypes.object.isRequired,
    }).isRequired,

    title: PropTypes.string,

  };

  static defaultProps = {
    isFetching: false,
  }

  static fetchData = fetchData;

  constructor(props) {
    super(props);
    this.handleFiltersSubmit = this.handleFiltersSubmit.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.state = this.getStateFromProps(props);
  }

  componentDidMount() {
    if (!this.props.firstRender) {
      fetchData(
        this.props.dispatch,
        { currentLocation: this.props.currentLocation },
        this.props.params,
        this.props.route.query
      );
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.route.url !== this.props.route.url) {
      fetchData(
        this.props.dispatch,
        { currentLocation: this.props.currentLocation },
        nextProps.params,
        nextProps.route.query
      );
    }
  }

  componentDidUpdate(prevProps) {
    const { currentLocation } = this.props;
    if (prevProps.currentLocation.slug !== currentLocation.slug) {
      this.updateList();
    }
  }

  getStateFromProps(props) {
    const within = parseInt(props.route.query.within, 10);
    const state = {
      free: !!props.route.query.free,
      within: isNaN(within) ? props.route.query.within : within,
    };
    return state;
  }

  updateList() {
    let path = `/search${getLocationPath(this.props.currentLocation)}`;
    const qs = getQuerystringFromSearchParams(this.state);
    if (qs) {
      path += `?${qs}`;
    }
    this.props.dispatch(push(path));
  }

  handleSortChange(sort, e) {
    e.target.blur();
    this.setState({ sort }, this.updateList);
  }

  handleFiltersSubmit(params) {
    this.setState({ ...params }, this.updateList);
  }

  render() {
    return (
      <Page className="Search">
        <Helmet title={ this.props.title } />
        <Desktop>
          <StartColumn>
            <SearchFilters
              disabled={ false }
              query={ {
                ...this.props.query,
                within: this.state.within,
                free: this.state.free,
              } }
              onSubmit={ this.handleFiltersSubmit }
              />
          </StartColumn>
        </Desktop>
        <Body>
          <ShoutsListToolbar
            showProgress={ this.props.isFetching }
            sortType={ this.state.sort }
            count={ this.props.count }
            onSortChange={ this.handleSortChange }
          />
          <div className="Shouts-container">
            <ShoutsList shouts={ this.props.shouts } />
            { this.props.isFetching &&
              <div className="Shouts-loadingBackdrop" />
            }
          </div>
          { this.props.shouts.length > 0 &&
            <Pagination
              pageSize={ this.props.query.page_size }
              currentPage={ this.props.query.page }
              count={ this.props.count }
            />
          }
        </Body>
      </Page>
    );
  }

}

const mapStateToProps = (state, ownProps) => {
  const routingQuery = getQuery(state);
  const page = routingQuery.page || 1;
  const query = getShoutsQuery(state);
  const count = getShoutsCount(state);
  const pageState = getShoutsPageState(state, page);
  const currentLocation = getCurrentLocation(state);

  let title;

  if (query.category) {
    const category = getCategory(state, query.category).name;
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
    title,
    currentLocation,
    query,
    within: routingQuery.within,
    free: !!routingQuery.free,
    count,
    isFetching: pageState.isFetching,
    error: pageState.error,
    shouts: getShouts(state, page),
    route: {
      url: getCurrentUrl(state),
      query: getQuery(state),
    },
  };

};

const Wrapped = injectIntl(connect(mapStateToProps)(Search));
Wrapped.fetchData = Search.fetchData;
export default Wrapped;
