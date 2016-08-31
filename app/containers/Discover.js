/* eslint-env browser */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import isEqual from 'lodash/isEqual';
import { FormattedMessage } from 'react-intl';

import PropTypes, { PaginationPropTypes } from '../utils/PropTypes';

import { getCurrentLanguage } from '../reducers/i18n';
import { getCurrentUrl } from '../reducers/routing';

import Helmet from '../utils/Helmet';
import Device from '../utils/Device';

import Page, { Body, EndColumn } from '../layout/Page';

import DiscoverItemPreview from '../discover/DiscoverItemPreview';

import SuggestedShout from '../shouts/SuggestedShout';
import ShoutsList from '../shouts/ShoutsList';

import Scrollable from '../layout/Scrollable';
import CountryFlag from '../location/CountryFlag';
import Progress from '../widgets/Progress';

import { loadDiscoverItems, loadDiscoverItem, loadDiscoverItemShouts } from '../actions/discoverItems';
import { getCountryName, getLocationPath } from '../utils/LocationUtils';
import { backgroundImageStyle } from '../utils/DOMUtils';
// import { denormalize } from '../schemas';

import LocationModal from '../location/LocationModal';
import { openModal } from '../actions/ui';
import { routeError } from '../actions/server';

import { getDiscoverItemsByCountry, getPaginationState as getDiscoverItemsPagination } from '../reducers/paginated/discoverItemsByCountry';
import { getShoutsByDiscoverItem, getPaginationState as getShoutsPagination } from '../reducers/paginated/shoutsByDiscoverItem';
import { getDiscoverItem } from '../reducers/entities/discoverItems';
import { getCurrentLocation } from '../reducers/currentLocation';

import './Discover.scss';

const page_size = 9;

const fetchData = (dispatch, state, params) => {
  const { country, id } = params;
  if (id) {
    return dispatch(loadDiscoverItem(id))
      .then(() => dispatch(loadDiscoverItemShouts(id, { page_size })))
      .catch(err => dispatch(routeError(err)));
  }

  return dispatch(loadDiscoverItems(country))
    .then(({ result }) =>
      Promise.all([
        ...result.map(id => dispatch(loadDiscoverItem(id))),
        ...result.map(id => dispatch(loadDiscoverItemShouts(id, { page_size }))),
      ])
    )
    .catch(err => dispatch(routeError(err)));
};

function getDiscoverLink(country, discoverItem) {
  let url = '/discover';
  if (country) {
    url += getLocationPath({ country });
  }
  if (discoverItem) {
    url += `/${discoverItem.id}`;
  }
  return url;
}

export class Discover extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,

    country: PropTypes.string,
    currentLocation: PropTypes.object,
    discoverItem: PropTypes.object,
    firstRender: PropTypes.bool,

    discoverItemsPagination: PropTypes.shape(PaginationPropTypes),
    shoutsPagination: PropTypes.shape(PaginationPropTypes),

    language: PropTypes.string.isRequired,
    shouts: PropTypes.array,

  };

  static fetchData = fetchData;

  componentDidMount() {
    const { firstRender, dispatch, params } = this.props;
    if (!firstRender) {
      fetchData(dispatch, null, params);
    }
  }

  componentWillUpdate(nextProps) {
    const { dispatch, params } = this.props;
    if (nextProps.params.id !== params.id) {
      dispatch(loadDiscoverItem(nextProps.params.id)).then(() => {
        dispatch(loadDiscoverItemShouts(nextProps.params.id, { page_size }));
      });
    } else if (params.country !== nextProps.params.country) {
      fetchData(dispatch, null, nextProps.params);
    }
  }

  componentDidUpdate(prevProps) {
    const { dispatch, currentLocation } = this.props;
    if (!isEqual(prevProps.currentLocation, currentLocation)) {
      dispatch(push(`/discover/${currentLocation.country.toLowerCase()}`));
    }
  }

  showLocationModal(e) {
    e.preventDefault();
    e.target.blur();
    this.props.dispatch(openModal(
      <LocationModal />
    ));
  }

  render() {
    const {
      country,
      discoverItem,
      dispatch,
      shoutsPagination,
      discoverItemsPagination,
      shouts,
    } = this.props;

    return (
      <Scrollable
        triggerOffset={ 400 }
        scrollElement={ () => window }
        onScrollBottom={ () => {
          if (discoverItem && shoutsPagination.nextUrl && !shoutsPagination.isFetching) {
            dispatch(loadDiscoverItemShouts(discoverItem.id, null, shoutsPagination.nextUrl));
          }
        } }>
        <Page>
          { discoverItem && <Helmet appUrl={ discoverItem.appUrl } title={ discoverItem.title } images={ [discoverItem.image] } /> }
          <Body>
            { discoverItem &&
              <div className="Discover-hero"
                style={ backgroundImageStyle({ url: discoverItem.image, variation: 'large' }) }>
                { country &&
                  <div className="Discover-country" onClick={ e => this.showLocationModal(e) }>
                    <CountryFlag code={ country } rounded size="medium" showTooltip={ false } />
                    { getCountryName(country, this.props.language) }
                  </div>
                }
                <div className="Discover-hero-content">
                  <h1>{ discoverItem.title }</h1>
                  { discoverItem.subtitle && <h2>{ discoverItem.subtitle }</h2> }
                </div>
              </div>
            }

            { discoverItem && discoverItem.showChildren && discoverItem.children &&
              <div className="Discover-children">
                { discoverItem.children.map((child, i) =>
                  <Link to={ getDiscoverLink(country, child) } key={ i }>
                    <DiscoverItemPreview discoverItem={ child } />
                  </Link>
                ) }
              </div>
            }

            { shouts && shouts.length > 0 &&
              <div className="Discover-shouts">
                <h2>
                  <FormattedMessage
                    defaultMessage="{discoverItemTitle} Shouts"
                    id="discover.shouts.title"
                    values={ { discoverItemTitle: discoverItem.title } }
                  />
                </h2>
                <ShoutsList columns={ 3 } shouts={ shouts } />
              </div>
            }
            <Progress animate={ shoutsPagination.isFetching } />
            <Progress animate={ discoverItemsPagination.isFetching && !discoverItem } />
          </Body>
          <Device type="desktop">
            <EndColumn footer>
              <SuggestedShout />
            </EndColumn>
          </Device>
        </Page>
      </Scrollable>
    );
  }

}

const mapStateToProps = (state, ownProps) => {
  // const { paginated, entities, currentLocation } = state;
  // const { country, id } = ownProps.params;

  let discoverItem;

  // let isFetching = false;

  if (ownProps.params.id) {
    discoverItem = getDiscoverItem(state, ownProps.params.id);
  } else {
    const discoverItemsByCountry = getDiscoverItemsByCountry(state, ownProps.params.country);
    discoverItem = discoverItemsByCountry ? discoverItemsByCountry[0] : undefined;
  }

  let shouts;
  if (discoverItem) {
    shouts = getShoutsByDiscoverItem(state, discoverItem.id);
  }

  return {
    language: getCurrentLanguage(state),
    country: ownProps.params.country,
    currentUrl: getCurrentUrl(state),
    currentLocation: getCurrentLocation(state),
    discoverItem,
    shouts,
    shoutsPagination: discoverItem ? getShoutsPagination(state, discoverItem.id) : {},
    discoverItemsPagination: getDiscoverItemsPagination(state, ownProps.params.country),
  };
};

const Wrapped = connect(mapStateToProps)(Discover);
Wrapped.fetchData = Discover.fetchData;
export default Wrapped;
