import React from 'react';
import {StoreWatchMixin} from 'fluxxor';
import DocumentTitle from 'react-document-title';

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

    renderDiscoverPage(discover) {
        console.log(discover);
        return null;
    },

    renderLoading() {
        return (
            <DocumentTitle title="[Loading...] - Shoutit">
                <Loader />
            </DocumentTitle>
        );
    },

    render() {
        const {discoverId:disId} = this.props || this.context.params,
            {discovers} = this.state,
            discover = disId && discovers? discovers[disId] : null;

        if(discover) {
            if(discover.loading) {
                this.renderLoading();
            } else {
                return renderDiscoverPage(discover);
            }
        } else {
            return ( <p>Something unexpected happened!!!</p> );
        }

    }
});