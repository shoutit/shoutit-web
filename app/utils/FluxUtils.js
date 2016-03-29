import React from 'react';
import { StoreWatchMixin } from 'fluxxor';
import debug from 'debug';

export function ConnectToStores(Component, { fetchData, listenToStores = [], mapStoresProps }) {

  const logError = err => {
    if (err) {
      console.error(err); // eslint-disable-line
    }
  };

  const displayName = Component.displayName || Component.name;

  return React.createClass({

    displayName: `FetchData:${displayName}`,

    propTypes: {
      flux: React.PropTypes.object,
      params: React.PropTypes.object,
      query: React.PropTypes.object,
      firstRender: React.PropTypes.bool
    },

    contextTypes: {
      query: React.PropTypes.object,
      params: React.PropTypes.object
    },

    childContextTypes: {
      query: React.PropTypes.object,
      params: React.PropTypes.object
    },

    mixins: [new StoreWatchMixin(...listenToStores)],

    // statics: { fetchData },

    getChildContext() {
      return { query: this.props.query, params: this.props.params };
    },

    componentDidMount() {
      if (!fetchData) {
        return;
      }

      if (this.props.firstRender) {
        debug('shoutit:ConnectToStores')('%s component rendering for the first time, skip data fetching', displayName);
        return false;
      }
      debug('shoutit:ConnectToStores')('%s component did mount, fetching data...', displayName);

      const flux = this.props.flux || this.context.flux;
      const params = this.props.params || this.context.params;
      const query = this.props.query || this.context.query;

      fetchData(flux, params, query, logError);
    },

    getInstance() {
      return this.refs.instance;
    },

    getStateFromFlux() {
      if (!mapStoresProps) {
        return {};
      }
      const flux = this.props.flux || this.context.flux;
      const params = this.props.params || this.context.params;
      const query = this.props.query || this.context.query;

      return mapStoresProps(flux.stores, params, query);
    },

    render() {
      return <Component {...this.props} { ...this.state } ref="instance" />;
    }

  });

}
