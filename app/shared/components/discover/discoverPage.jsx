import React from 'react';
import {Link} from 'react-router';
import {StoreWatchMixin} from 'fluxxor';
import DocumentTitle from 'react-document-title';
import {Grid, Column, Loader} from '../helper';

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

    componentDidMount() {
        this.loadData();
    },

    componentDidUpdate() {
        this.loadData();
    },

    loadData() {
        const disId = this.props.pk || this.context.params.pk,
            {discovers} = this.state,
            discover = disId && discovers? discovers[disId] : null;

        if(!discover) {
           this.context.flux.actions.loadDiscoverWithId(disId);
        }
    },

    renderDiscoverPage(discover) {
        const list = discover.children;
        const country = this.context.params.country;

        return (
            <DocumentTitle title={discover.title}>
                <Grid fluid={true}>
                    {list &&
                        list.map((item, idx) => {
                            return (
                                <Column size="3" key={'discover-' + idx} clear={idx%3 === 0}>
                                    <Link to={`/discover/${country}/${item.id}`} >{item.title}</Link>
                                </Column>);
                        })
                    }
                </Grid>
            </DocumentTitle>
        );
    },

    renderLoading() {
        return (
            <DocumentTitle title="[Loading...] - Shoutit">
                <Loader />
            </DocumentTitle>
        );
    },

    render() {
        const disId = this.props.pk || this.context.params.pk,
            {discovers} = this.state,
            discover = disId && discovers? discovers[disId] : null;

        if(discover) {
            if(discover.loading) {
                return this.renderLoading();
            } else {
                return this.renderDiscoverPage(discover);
            }
        } else {
            return ( <p>Something unexpected happened!!!</p> );
        }

    }
});