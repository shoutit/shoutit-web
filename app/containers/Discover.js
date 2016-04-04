import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Page from '../layout/Page';

import DiscoverItemPreview from '../discover/DiscoverItemPreview';

import SuggestedShout from '../shouts/SuggestedShout';
import ShoutsList from '../shouts/ShoutsList';
import Scrollable from '../ui/Scrollable';
import Progress from '../ui/Progress';

import { loadDiscoverItemsByCountry, loadDiscoverItem, loadShoutsForDiscoverItem } from '../actions/discover';
import { getCountryCode } from '../utils/LocationUtils';
import { getStyleBackgroundImage } from '../utils/DOMUtils';
import { denormalize } from '../schemas';

if (process.env.BROWSER) {
  require('./Discover.scss');
}

const page_size = 9;

const fetchData = (store, params) => {
  const { dispatch } = store;
  const { countryName } = params;
  const country = getCountryCode(countryName);

  if (params.id) {
    return dispatch(loadDiscoverItem(params.id)).then(() =>
      dispatch(loadShoutsForDiscoverItem(params.id, { page_size }))
    );
  }

  return dispatch(loadDiscoverItemsByCountry(country)).then(({ result }) => {
    Promise.all([
      ...result.map(id => dispatch(loadDiscoverItem(id))),
      ...result.map(id => dispatch(loadShoutsForDiscoverItem(id, { page_size }))),
    ]);
  });
};

export class Discover extends Component {

  static propTypes = {
    country: PropTypes.string.isRequired,
  };

  static fetchData = fetchData;

  componentDidMount() {
    const { firstRender, country, dispatch, params } = this.props;
    if (!firstRender) {
      if (params.id) {
        dispatch(loadDiscoverItem(params.id)).then(() => {
          dispatch(loadShoutsForDiscoverItem(params.id, { page_size }));
        });
      } else {
        dispatch(loadDiscoverItemsByCountry(country)).then(({ result }) => {
          result.forEach(id => dispatch(loadDiscoverItem(id)));
          result.forEach(id => dispatch(
            loadShoutsForDiscoverItem(id, { page_size })
          ));
        });
      }
    }
  }

  componentWillUpdate(nextProps) {
    const { country, dispatch, params } = this.props;
    if (nextProps.params.id !== params.id) {
      dispatch(loadDiscoverItem(nextProps.params.id)).then(() => {
        dispatch(loadShoutsForDiscoverItem(nextProps.params.id, { page_size }));
      });
    } else if (nextProps.country !== country) {
      dispatch(loadDiscoverItemsByCountry(nextProps.country)).then(({ result }) => {
        result.forEach(id => dispatch(loadDiscoverItem(id)));
        result.forEach(id => dispatch(
          loadShoutsForDiscoverItem(id, { page_size })
        ));
      });
    }
  }

  render() {
    const { discoverItem, shouts, nextShoutsUrl, isFetchingShouts, dispatch, countryName } = this.props;
    return (
      <Scrollable
        triggerOffset={ 400 }
        scrollElement={ () => window }
        onScrollBottom={ () => {
          if (discoverItem && nextShoutsUrl && !isFetchingShouts) {
            dispatch(loadShoutsForDiscoverItem(discoverItem.id, null, nextShoutsUrl));
          }
        }}>
        <Page title="Discover" endColumn={ <SuggestedShout /> }>

          { discoverItem &&
            <div className="Discover-hero" style={ getStyleBackgroundImage(discoverItem.image, 'large') }>
              <div className="Discover-hero-content">
                <h1>{ discoverItem.title }</h1>
                { discoverItem.subtitle && <h2>{ discoverItem.subtitle }</h2> }
              </div>
            </div>
          }

          { discoverItem && discoverItem.showChildren && discoverItem.children &&
            <div className="Discover-children">
              { discoverItem.children.map(child =>
                <Link to={`/discover/${countryName}/${child.id}`}>
                  <DiscoverItemPreview discoverItem={ child } />
                </Link>
              )}
            </div>
          }

          { discoverItem && discoverItem.showShouts && shouts.length > 0 &&
            <div className="Discover-shouts">
              <ShoutsList shouts={ shouts } />
            </div>
          }

          <Progress animate={ isFetchingShouts } label="Loading shouts…" />

        </Page>
      </Scrollable>
    );
  }

}

const mapStateToProps = (state, ownProps) => {
  const { paginated, entities } = state;
  const { countryName, id } = ownProps.params;
  const country = getCountryCode(countryName);
  let discoverItem;
  if (id) {
    discoverItem = entities.discoverItems[id];
  } else if (paginated.discoverItemsByCountry[country]) {
    const discoverItems = paginated.discoverItemsByCountry[country].ids.map(
      id => entities.discoverItems[id]
    );
    if (discoverItems.length > 0) {
      discoverItem = discoverItems[0];
    }
  }

  let shouts = [];
  let isFetchingShouts = false;
  let nextShoutsUrl;
  if (discoverItem) {
    discoverItem = denormalize(discoverItem, entities, 'DISCOVERITEM');
    const shoutsByDiscoverItem = paginated.shoutsByDiscoverItem[discoverItem.id];
    if (shoutsByDiscoverItem) {
      isFetchingShouts = shoutsByDiscoverItem.isFetching;
      nextShoutsUrl = shoutsByDiscoverItem.nextUrl;

      shouts = shoutsByDiscoverItem.ids.map(id => entities.shouts[id]);
    }
  }

  return {
    countryName,
    country,
    discoverItem,
    shouts,
    isFetchingShouts,
    nextShoutsUrl,
  };
};

export default connect(mapStateToProps)(Discover);
