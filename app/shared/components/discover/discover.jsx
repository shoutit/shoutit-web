import React from 'react';
import {StoreWatchMixin} from 'fluxxor';
import {Grid, Column, Loader} from '../helper';
import DocumentTitle from 'react-document-title';
import DiscoverPage from './discoverPage.jsx';

export default React.createClass({
    mixins: [new StoreWatchMixin("discovers")],

    statics: {
        // TODO: change it to proper values for server rendering
        fetchId: 'user',
        fetchData(client, session, params) {
            return client.users().get(session, params.username);
        }
    },

    contextTypes: {
        params: React.PropTypes.object,
        flux: React.PropTypes.object
    },

    getStateFromFlux() {
        const disStore = this.context.flux.store("discovers").getState();
        return {
            loading: disStore.loading,
            countries: disStore.countries,
            discovers: disStore.discovers,
            shouts: disStore.shouts
        }
    },

    renderLoading() {
        return(
            <DocumentTitle title="[Loading...] - Shoutit">
                <Loader />
            </DocumentTitle>
        );
    },

    renderDisoverPage(id) {
        return (
            <DiscoverPage discoverId={id} />
        )
    },

    render() {
        const {country} = this.context.params,
              {countries, discovers, loading} = this.state,
              disId = countries? countries[country]: null,
              discover = disId && discovers? discovers[disId]: null;

        if(loading) {
            return this.renderLoading();
        } else if(discover) {
            return this.renderDiscoverPage(disId);
        } else {
            return ( <p>Something unexpected happened!</p> );
        }
    }
});