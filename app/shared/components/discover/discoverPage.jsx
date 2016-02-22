import React from 'react';
import {Link} from 'react-router';
import {StoreWatchMixin} from 'fluxxor';
import DocumentTitle from 'react-document-title';
import {Grid, Column, Progress} from '../helper';
import {ItemScope, ItemProp} from './../helper/microdata';
import CoverImage from './coverImage.jsx';
import GridDiscover from './gridDiscover.jsx';
import ShoutPreview from "../shout/ShoutPreview.jsx";
import ViewportSensor from '../misc/ViewportSensor.jsx';

export default React.createClass({
  mixins: [new StoreWatchMixin("discovers", "shouts")],

  statics: {
    // TODO: change it to proper values for server rendering
    fetchId: 'discoverid',
    fetchData(client, session, params) {
      return client.discover().get(session, params.pk);
    }
  },

  getStateFromFlux() {
    const disStore = this.props.flux.store("discovers").getState();
    const shoutsStore = this.props.flux.store("shouts").getState();
    return {
      loading: disStore.loading,
      countries: disStore.countries,
      discovers: disStore.discovers,
      shouts: disStore.shouts,
      discoverShouts: shoutsStore.discoverShouts
    }
  },

  componentDidMount() {
    this.loadData();
  },

  componentDidUpdate() {
    this.loadData();
  },

  loadData() {
    const disId = this.props.pk || this.props.params.pk,
      {discovers} = this.state,
      discover = disId && discovers ? discovers[disId] : null;

    if (!discover) {
      this.props.flux.actions.loadDiscoverWithId(disId);
    }
  },

  renderDiscoverPage(discover) {
    const disId = this.props.pk || this.props.params.pk
    const list = discover.children;
    const country = this.props.params.country;
    const shoutsList = this.state.shouts[disId] ? this.state.shouts[disId].list : [];
    const shouts = shoutsList.map((shoutId) => this.state.discoverShouts[shoutId]);

    return (
      <DocumentTitle title={discover.title + ' - Shoutit'}>
        <Grid fluid={true}>
          <CoverImage title={discover.title} image={discover.image}/>
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
            {shouts.length?
              <Grid fluid={true}>
                <h3 className="si-center-header">Shouts</h3>
                {shouts.map((item, idx) => {
                  return (
                    <ItemScope type="Product" key={"disShout-" + idx}>
                      <ShoutPreview
                        index={idx}
                        shout={item}
                        gridview={true}
                        columnsPerRow={4}
                      />
                    </ItemScope>
                  );
                })}
                {this.renderViewportSensor()}
              </Grid>
              :
              null
            }
          </Grid>
          {/*shouts.length ? <Link to="" className="si-more-link pull-right">Explore More...</Link> : null*/}
        </Grid>
      </DocumentTitle>
    );
  },

  renderLoading() {
    return (
      <DocumentTitle title="[Loading...] - Shoutit">
        <Progress />
      </DocumentTitle>
    );
  },

  renderViewportSensor() {
    const { shouts } = this.state;
    const disId = this.props.pk || this.props.params.pk;

    if (!shouts[disId]) { return null; };

    if(shouts[disId].loading) {
      return (
        <Progress />
      );
    } else {
      return (
        <Grid fluid={true}>
          <ViewportSensor onChange={this.onLastVisibleChange}></ViewportSensor>
        </Grid>
      );
    }
  },

  onLastVisibleChange(isVisible) {
    if (isVisible) {
      this.props.flux.actions.loadMoreDiscoverShouts(this.props.pk);
    }
  },

  render() {
    const disId = this.props.pk || this.props.params.pk,
      {discovers} = this.state,
      discover = disId && discovers ? discovers[disId] : null;

    if (discover) {
      if (discover.loading) {
        return this.renderLoading();
      } else {
        return this.renderDiscoverPage(discover);
      }
    } else {
      return ( <p>Something unexpected happened!!!</p> );
    }

  }
});
