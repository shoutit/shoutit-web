import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import Helmet from '../utils/Helmet';

import Page from '../layout/Page';

import DiscoverItemPreview from '../discover/DiscoverItemPreview';

import SuggestedShout from '../shouts/SuggestedShout';
import ShoutsList from '../shouts/ShoutsList';

import Modal from '../ui/Modal';
import Scrollable from '../ui/Scrollable';
import CountryFlag from '../ui/CountryFlag';
import Progress from '../ui/Progress';

import { loadDiscoverItemsByCountry, loadDiscoverItem, loadShoutsForDiscoverItem } from '../actions/discover';
import { getCountryCode, getCountryName } from '../utils/LocationUtils';
import { getStyleBackgroundImage } from '../utils/DOMUtils';
import { denormalize } from '../schemas';

import SearchLocation from '../location/SearchLocation';

import { openModal, closeModal } from '../actions/ui';
import { setUserLocation } from '../actions/users';
import { setCurrentLocation } from '../actions/location';
import { routeError } from '../actions/server';

if (process.env.BROWSER) {
  require('./Discover.scss');
}

const page_size = 9;

const fetchData = (dispatch, state, params) => {
  const { countryName } = params;
  let country;
  if (countryName) {
    country = getCountryCode(decodeURIComponent(countryName));
    if (!country) {
      const error = new Error('Country does not exists');
      error.statusCode = 404;
      return dispatch(routeError(error));
    }
  }

  if (params.id) {
    return dispatch(loadDiscoverItem(params.id))
      .then(() => dispatch(loadShoutsForDiscoverItem(params.id, { page_size })))
      .catch(err => dispatch(routeError(err)));
  }

  return dispatch(loadDiscoverItemsByCountry(country))
    .then(({ result }) =>
      Promise.all([
        ...result.map(id => dispatch(loadDiscoverItem(id))),
        ...result.map(id => dispatch(loadShoutsForDiscoverItem(id, { page_size }))),
      ])
    )
    .catch(err => dispatch(routeError(err)));
};

function getDiscoverLink(country, discoverItem) {
  let url = '/discover';
  if (country) {
    const countryName = getCountryName(country);
    if (countryName) {
      url += `/${encodeURIComponent(countryName).toLowerCase()}`;
    }
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
    discoverItem: PropTypes.object,
    firstRender: PropTypes.bool,
    isFetching: PropTypes.bool,
    isFetchingShouts: PropTypes.bool,
    loggedUser: PropTypes.object,
    nextShoutsUrl: PropTypes.string,
    shouts: PropTypes.array,
    shoutsCount: PropTypes.number,
  };
  static fetchData = fetchData;

  componentDidMount() {
    const { firstRender, dispatch, params } = this.props;
    if (!firstRender) {
      fetchData(dispatch, null, params);
    }
  }

  componentWillUpdate(nextProps) {
    const { country, dispatch, params } = this.props;
    if (nextProps.params.id !== params.id) {
      dispatch(loadDiscoverItem(nextProps.params.id)).then(() => {
        dispatch(loadShoutsForDiscoverItem(nextProps.params.id, { page_size }));
      });
    } else if (nextProps.country !== country) {
      fetchData(dispatch, null, nextProps.params);
    }
  }

  showLocationModal(e) {
    e.preventDefault();
    e.target.blur();
    const { dispatch, loggedUser } = this.props;
    const modal = (
      <Modal title="Change location" name="search-location">
        <SearchLocation
          onLocationSelect={ location => {
            dispatch(push(getDiscoverLink(location.country)));
            dispatch(closeModal('search-location'));
            dispatch(setCurrentLocation(location));
            if (loggedUser) {
              dispatch(setUserLocation(location));
            }
          }}
        />
      </Modal>
    );
    this.props.dispatch(openModal(modal));
  }

  render() {
    const {
      country,
      discoverItem,
      dispatch,
      isFetching,
      isFetchingShouts,
      nextShoutsUrl,
      shouts,
    } = this.props;

    return (
      <Scrollable
        triggerOffset={ 400 }
        scrollElement={ () => window }
        onScrollBottom={ () => {
          if (discoverItem && nextShoutsUrl && !isFetchingShouts) {
            dispatch(loadShoutsForDiscoverItem(discoverItem.id, null, nextShoutsUrl));
          }
        }}>
        <Page endColumn={ <SuggestedShout /> }>
          { discoverItem && <Helmet title={ discoverItem.title } images={[discoverItem.image]} /> }
          { discoverItem &&
            <div className="Discover-hero" style={ getStyleBackgroundImage(discoverItem.image, 'large') }>
              { country && <div className="Discover-country" onClick={ e => this.showLocationModal(e) }>
                  <CountryFlag code={ country } rounded size="medium" showTooltip={ false } />
                  { getCountryName(country) }
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
              )}
            </div>
          }

          { discoverItem && discoverItem.showShouts && shouts.length > 0 &&
            <div className="Discover-shouts">
              <h2>{ discoverItem.title } Shouts</h2>
              <ShoutsList columns={ 3 } shouts={ shouts } />
            </div>
          }

          <Progress animate={ isFetchingShouts } label="Loading shouts…" />
          <Progress animate={ isFetching && !discoverItem } label="Loading…" />

        </Page>
      </Scrollable>
    );
  }

}

const mapStateToProps = (state, ownProps) => {
  const { paginated, entities } = state;
  const { countryName, id } = ownProps.params;

  let discoverItem;

  let country;
  if (countryName) {
    country = getCountryCode(countryName);
  }

  const discoverItemsByCountry = paginated.discoverItemsByCountry[country];
  let isFetching = false;

  if (id) {
    discoverItem = entities.discoverItems[id];
  } else if (discoverItemsByCountry) {
    const discoverItems = discoverItemsByCountry.ids.map(
      id => entities.discoverItems[id]
    );
    isFetching = discoverItemsByCountry.isFetching;
    if (discoverItems.length > 0) {
      discoverItem = discoverItems[0];
    }
  }

  let shouts = [];
  let isFetchingShouts = false;
  let nextShoutsUrl;
  let shoutsCount;
  if (discoverItem) {
    discoverItem = denormalize(discoverItem, entities, 'DISCOVERITEM');
    const shoutsByDiscoverItem = paginated.shoutsByDiscoverItem[discoverItem.id];
    if (shoutsByDiscoverItem) {
      isFetchingShouts = shoutsByDiscoverItem.isFetching;
      nextShoutsUrl = shoutsByDiscoverItem.nextUrl;
      shoutsCount = shoutsByDiscoverItem.count;
      shouts = shoutsByDiscoverItem.ids.map(id => denormalize(entities.shouts[id], entities, 'SHOUT'));
    }
  }

  return {
    countryName,
    country,
    discoverItem,
    shouts,
    isFetching,
    isFetchingShouts,
    nextShoutsUrl,
    shoutsCount,
  };
};

export default connect(mapStateToProps)(Discover);
