import React from 'react';
import {Link} from 'react-router';
import {StoreWatchMixin} from 'fluxxor';
import DocumentTitle from 'react-document-title';
import {Grid, Column, Loader} from '../helper';
import CoverImage from './coverImage.jsx';

export default React.createClass({
    mixins: [new StoreWatchMixin("discovers", "shouts")],

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
        const shoutsStore = this.context.flux.store("shouts").getState();
        return {
            loading: disStore.loading,
            countries: disStore.countries,
            discovers: disStore.discovers,
            shouts: disStore.shouts,
            fullShouts: shoutsStore.fullShouts
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
        const disId = this.props.pk || this.context.params.pk
        const list = discover.children;
        const country = this.context.params.country;

        const shoutsList = this.state.shouts[disId].list;
        const shouts = shoutsList.map((shoutId) => this.state.fullShouts[shoutId]);

        return (
            <DocumentTitle title={discover.title + ' - Shoutit'}>
                <Grid fluid={true}>
                    <CoverImage title={discover.title} image={discover.image} />
                    <Grid fluid={true}>
                    {list.map((item, idx) => {
                        return (
                            <Column size="3" key={"discover-" + idx} clear={idx%3 === 0}>
                                <Link to={`/discover/${country}/${item.id}`} >{item.title}</Link>
                            </Column>);
                        })
                    }
                    </Grid>
                    <Grid fluid={true}>
                        {shouts.map((item, idx) => {
                            return (
                                <Column size="3" key={"disShout-" + idx} clear={idx%3 === 0}>
                                    <Link to={`/shout/${item.id}`} >{item.title}</Link>
                                </Column>
                            );
                        })
                        }
                    </Grid>
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