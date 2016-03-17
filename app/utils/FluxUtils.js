import React from "react";
import { StoreWatchMixin } from "fluxxor";
import debug from "debug";

export function fetchDataForRoutes(routes, params, query, flux, done) {
  const promises = [];

  const routesToFetch = routes.filter(route =>
    route.component && route.component.fetchData
  );

  routesToFetch.map(route => {
    const promise = new Promise((resolve, reject) => {
      route.component.fetchData(flux, params, query, err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
    promises.push(promise);
  });

  Promise.all(promises).then(
    () => done(),
    err => done(err) // fail-fast if one of the route's fetchData error'ed
  );
}

export function ConnectToStores(Component, { fetchData, listenToStores=[], mapStoresProps }) {

  const logError = err => {
    if (err) {
      console.error(err); // eslint-disable-line
    }
  };

  const displayName = Component.displayName || Component.name;

  return React.createClass({

    displayName: `FetchData:${displayName}`,

    mixins: [new StoreWatchMixin(...listenToStores)],

    statics: {
      fetchData: (flux, params, query, done) => {
        debug("shoutit:ConnectToStores")("Start fetching data for %s...", displayName);
        fetchData(flux, params, query, done);
      }
    },

    componentDidMount() {
      if (this.props.firstRender) {
        debug("shoutit:ConnectToStores")("%s component rendering for the first time, skip data fetching", displayName);
        return false;
      }
      debug("shoutit:ConnectToStores")("%s component did mount, fetching data...", displayName);
      fetchData(this.props.flux, this.props.params, this.props.location.query, logError);
    },

    getInstance() {
      return this.refs.instance;
    },

    getStateFromFlux() {
      if (!mapStoresProps) {
        return {};
      }
      const { flux, params, location } = this.props;
      return mapStoresProps(flux.stores, params, location.query);
    },

    render() {
      return <Component {...this.props} { ...this.state } ref="instance" />;
    }

  });

}
