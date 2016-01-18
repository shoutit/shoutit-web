import React from 'react';
import {Link} from 'react-router';
import {StoreWatchMixin} from 'fluxxor';
import DocumentTitle from 'react-document-title';
import {Grid, Column, Loader} from '../helper';
import {ItemScope, ItemProp} from './../helper/microdata';
import CoverImage from './coverImage.jsx';
import GridDiscover from './gridDiscover.jsx';
import GridShout from './../feed/feed/gridShout/gridShoutItem.jsx';

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
        const shoutsList = this.state.shouts[disId]? this.state.shouts[disId].list: [];
        const shoutsAreLoading = this.state.shouts[disId]? this.state.shouts[disId].loading: false;
        const shouts = shoutsList.map((shoutId) => this.state.fullShouts[shoutId]);

        return (
            <DocumentTitle title={discover.title + ' - Shoutit'}>
                <Grid fluid={true}>
                    <CoverImage title={discover.title} image={discover.image} />
                    <Grid fluid={true}>
                    {list.map((item, idx) => {
                        return (
                            <GridDiscover index={idx}
                                          discover={item}
                                          country={country}
                                          key={"discover-" + idx}
                                          />
                        );
                        })
                    }
                    </Grid>
                    <Grid fluid={true}>
                        {shouts.length? <h3 className="si-center-header">Shouts</h3>: null}
                        {shoutsAreLoading?
                            <Loader />
                            :
                            shouts.map((item, idx) => {
                                return (
                                    <ItemScope type="Product" key={"disShout-" + idx}>
                                        <GridShout index={idx}
                                                   shout={item}
                                                   creator={item.user}
                                                   clearOn={4}
                                                    />
                                    </ItemScope>
                                );
                            })
                        }
                    </Grid>
                    {shouts.length? <Link to="" className="si-more-link pull-right">Explore More...</Link>: null}
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