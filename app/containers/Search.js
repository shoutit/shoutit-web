/* eslint-env browser */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';

import { push } from 'react-router-redux';

import Helmet from '../utils/Helmet';
import { getLocationPath } from '../utils/LocationUtils';
import { getShouts, getShoutsCount, getShoutsPageState, getShoutsQuery } from '../reducers/paginated/shouts';
// import { getCategory } from '../reducers/categories';

import { getQuery, getCurrentUrl } from '../reducers/routing';

import { getSearchQuery, getQuerystringFromSearchParams } from '../utils/SearchUtils';

import { loadShouts } from '../actions/shouts';

import Page, { Body, StartColumn } from '../layout/Page';
import Pagination from '../layout/Pagination';
import ShoutsList from '../shouts/ShoutsList';
import ShoutsListToolbar from '../shouts/ShoutsListToolbar';
import SearchFilters from '../search/SearchFilters';

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
    ...getSearchQuery(query, state.currentLocation),
    page_size: 12,
  }));

export class Search extends Component {

  static propTypes = {
    currentUrl: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    currentLocation: PropTypes.object,
    error: PropTypes.object,
    firstRender: PropTypes.bool,
    params: PropTypes.object,
    query: PropTypes.object,
    shouts: PropTypes.array,
    page: PropTypes.number,

    count: PropTypes.number,
    isFetching: PropTypes.bool,

    route: PropTypes.shape({
      url: PropTypes.string.isRequired,
      query: PropTypes.object.isRequired,
    }).isRequired,

  };

  static defaultProps = {
    isFetching: false,
  }

  static fetchData = fetchData;

  constructor(props) {
    super(props);
    this.handleFiltersSubmit = this.handleFiltersSubmit.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.state = { };
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

  updateList() {
    const { dispatch, currentLocation } = this.props;
    let path = `/search${getLocationPath(currentLocation)}`;
    const qs = getQuerystringFromSearchParams(this.state);
    if (qs) {
      path += `?${qs}`;
    }
    dispatch(push(path));
  }

  handleSortChange(sort, e) {
    e.target.blur();
    this.setState({ sort }, this.updateList);
  }
  handleFiltersSubmit(params) {
    this.setState({ ...params }, this.updateList);
  }

  render() {
    const { shouts, query } = this.props;
    return (
      <Page className="Search">
        <Helmet />
        <StartColumn sticky>
          <SearchFilters
            disabled={ false }
            query={ {
              ...query,
              free: !!this.props.route.query.free,
              within: parseInt(this.props.route.query.within, 10),
            } }
            onSubmit={ this.handleFiltersSubmit }
            />
        </StartColumn>
        <Body>
          <ShoutsListToolbar
            showProgress={ this.props.isFetching }
            sortType={ this.state.sort }
            count={ this.props.count }
            onSortChange={ this.handleSortChange }
          />
          <ShoutsList shouts={ shouts } />
          { this.props.count > 0 &&
            <Pagination
              pageSize={ this.props.query.page_size }
              currentPage={ this.props.page }
              count={ this.props.count }
            />
          }
        </Body>
      </Page>
    );
  }

}

const mapStateToProps = state => {

  const page = getQuery(state).page || 1;
  const query = getShoutsQuery(state);
  const count = getShoutsCount(state);
  const pageState = getShoutsPageState(state, page);

  return {
    currentLocation: state.currentLocation,
    query,
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
