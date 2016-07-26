/* eslint-env browser */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import { FormattedMessage } from 'react-intl';
import { getCurrentLocale } from '../reducers/i18n';
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

import { loadDiscoverItemsByCountry, loadDiscoverItem, loadShoutsForDiscoverItem } from '../actions/discover';
import { getCountryName, getLocationPath } from '../utils/LocationUtils';
import { getStyleBackgroundImage } from '../utils/DOMUtils';
import { denormalize } from '../schemas';

import LocationModal from '../location/LocationModal';
import { openModal } from '../actions/ui';
import { routeError } from '../actions/server';

import './Discover.scss';

const page_size = 9;

const fetchData = (dispatch, state, params) => {
  const { country, id } = params;
  if (id) {
    return dispatch(loadDiscoverItem(id))
      .then(() => dispatch(loadShoutsForDiscoverItem(id, { page_size })))
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
    isFetching: PropTypes.bool,
    isFetchingShouts: PropTypes.bool,
    nextShoutsUrl: PropTypes.string,
    locale: PropTypes.string.isRequired,
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
    const { dispatch, params } = this.props;
    if (nextProps.params.id !== params.id) {
      dispatch(loadDiscoverItem(nextProps.params.id)).then(() => {
        dispatch(loadShoutsForDiscoverItem(nextProps.params.id, { page_size }));
      });
    } else if (params.country !== nextProps.params.country) {
      fetchData(dispatch, null, nextProps.params);
    }
  }

  componentDidUpdate(prevProps) {
    const { dispatch, currentLocation } = this.props;
    if (prevProps.currentLocation.slug !== currentLocation.slug) {
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
        } }>
        <Page>
          { discoverItem && <Helmet appUrl={ discoverItem.appUrl } title={ discoverItem.title } images={ [discoverItem.image] } /> }
          <Body>
            { discoverItem &&
              <div className="Discover-hero" style={ getStyleBackgroundImage(discoverItem.image, 'large') }>
                { country &&
                  <div className="Discover-country" onClick={ e => this.showLocationModal(e) }>
                    <CountryFlag code={ country } rounded size="medium" showTooltip={ false } />
                    { getCountryName(country, this.props.locale) }
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

            { discoverItem && discoverItem.showShouts && shouts.length > 0 &&
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
            <Progress animate={ isFetchingShouts } />
            <Progress animate={ isFetching && !discoverItem } />
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
  const { paginated, entities, currentLocation } = state;
  const { country, id } = ownProps.params;

  let discoverItem;

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
    locale: getCurrentLocale(state),
    country,
    currentUrl: getCurrentUrl(state),
    currentLocation,
    discoverItem,
    shouts,
    isFetching,
    isFetchingShouts,
    nextShoutsUrl,
    shoutsCount,
  };
};

const Wrapped = connect(mapStateToProps)(Discover);
Wrapped.fetchData = Discover.fetchData;
export default Wrapped;
