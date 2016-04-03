/**
 * This component loads the discover page based on a country code like "IN"
 * It use discoverPage.jsx to present the page, the same component which i-
 * s used for loading discover pages directly with id (called pk in API)
 */
import React from 'react';
import {StoreWatchMixin} from 'fluxxor';
import {Grid, Column, Progress} from '../helper';
import DiscoverPage from './discoverPage.jsx';
import DocumentTitle from "../../../ui/DocumentTitle";

export default React.createClass({
    mixins: [new StoreWatchMixin("discovers")],
    //
    // statics: {
    //     // TODO: change it to proper values for server rendering
    //     fetchId: 'discoverlist',
    //     fetchData(client, session, params) {
    //         return client.discover().list(session, params.country);
    //     }
    // },

    getStateFromFlux() {
        const disStore = this.props.flux.store("discovers").getState();
        return {
            loading: disStore.loading,
            countries: disStore.countries,
            discovers: disStore.discovers,
            shouts: disStore.shouts
        }
    },

    componentDidMount() {
        const {country} = this.props.params;
        const {flux} = this.props;

        if(this.state.countries && !this.state.countries[country]) {
            flux.actions.loadDiscoverWithCode(country);
        }
    },

    renderLoading() {
        return(
            <DocumentTitle title="[Loading...]">
                <Progress />
            </DocumentTitle>
        );
    },

    renderDiscoverPage(id) {
      const { flux, params } = this.props;
        return (
            <DiscoverPage flux={ flux } params={ params } pk={ id } />
        )
    },

    render() {
        const {country} = this.props.params,
              {countries, discovers, loading} = this.state,
              disId = countries? countries[country]: null,
              discover = disId && discovers? discovers[disId]: null;

        if(loading) {
            return this.renderLoading();
        } else if(discover) {
            if(discover.loading) {
                return this.renderLoading();
            } else {
                return this.renderDiscoverPage(disId);
            }
        } else {
            // TODO: remove it with an error after server rendering is fixed
            // This condition does not mean loading
            return this.renderLoading();
        }
    }
});
