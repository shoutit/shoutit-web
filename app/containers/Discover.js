import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Page from '../layout/Page';
import SuggestedShout from '../shouts/SuggestedShout';

import { loadMainDiscoverItem } from '../actions/discover';
import { getCountryCode } from '../utils/LocationUtils';

// if (process.env.BROWSER) {
//   require('./Discover.scss');
// }

const fetchData = (store, params) => {
  const { countryName } = params;
  const country = getCountryCode(countryName);
  if (!country) {
    return Promise.reject({ status: 404 });
  }
  return store.dispatch.loadMainDiscoverItem(country);
};

export class Discover extends Component {

  static propTypes = {
    country: PropTypes.string.isRequired,
  };

  static fetchData = fetchData;

  componentDidMount() {
    const { firstRender, country, dispatch } = this.props;
    // if (!firstRender) {
    dispatch(loadMainDiscoverItem(country));
    // }
  }

  render() {
    console.log(this.props.discoverItem);
    return (
      <Page title="Discover" endColumn={ <SuggestedShout /> }>
        Discover page

      </Page>
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
  return {
    country,
    discoverItem,
  };
};

export default connect(mapStateToProps)(Discover);
