import React from 'react';
import {StoreWatchMixin} from "fluxxor";
import {Grid, Column} from '../helper';
import {ListenToCard, TagsCard, SuggestShoutCard, ShareShoutCard, ShoutOwnerCard} from "../cards";

export default React.createClass({
  mixins: [new StoreWatchMixin('shouts', 'locations', 'users')],

  childContextTypes: {
    flux: React.PropTypes.object,
    params: React.PropTypes.object,
    location: React.PropTypes.object
  },

  getChildContext() {
    return {
      flux: this.props.flux,
      params: this.props.params,
      location: this.props.location
    };
  },

  statics: {
    fetchId: 'shout',
    fetchData(client, session, params) {
      return client.shouts().get(session, params.shoutId);
    }
  },

  getStateFromFlux() {
    const {flux, params} = this.props;
    const shoutStore = flux.store("shouts"),
      userStoreState = flux.store("users").getState(),
      shoutStoreState = JSON.parse(JSON.stringify(shoutStore.getState())),
      current = flux.store("locations").getState().current,
      findRes = shoutStore.findShout(params.shoutId);

    return {
      shoutId: this.props.params.shoutId,
      shout: findRes.shout || {},
      full: findRes.full,
      loading: shoutStoreState.loading,
      user: userStoreState.user,
      users: userStoreState.users,
      userShouts: userStoreState.shouts,
      relatedShouts: shoutStoreState.relatedShouts,
      replyDrafts: shoutStoreState.replyDrafts,
      current: current
    };
  },

  render() {
    const { loggedUser, flux } = this.props;
    const { shout, users } = this.state;
    return (
      <Grid className="profile-holder">
        <Column size="3" clear={true}>
          <ShareShoutCard />
        </Column>
        <Column size="9">
          { React.cloneElement(this.props.children, {...this.state}) }
        </Column>
        <Column size="3">
          <ShoutOwnerCard
            loggedUser={loggedUser}
            shout={ shout }
            users={ users }
            flux={ flux }
            />
          <TagsCard tags={[]}
              loading={false}
              />
          <ListenToCard />
          <SuggestShoutCard />
        </Column>
      </Grid>
    );
  }
});
