import React from 'react';
import {StoreWatchMixin} from 'fluxxor';
import DocumentTitle from 'react-document-title';
import ShoutDetailBody from './shoutDetailBody.jsx';
import Progress from '../helper/Progress.jsx';
import ShoutReplySection from './shoutReplySection.jsx';
import ShoutExtra from './shoutExtra.jsx';
import {Column, Grid} from '../helper';

var USER_EXTRA_SHOUTS_LIMIT = 3;

export default React.createClass({
  displayName: "ShoutDetail",
  mixins: [new StoreWatchMixin('shouts', 'locations', 'users')],

  statics: {
    fetchId: 'shout',
    fetchData(client, session, params) {
      return client.shouts().get(session, params.shoutId);
    }
  },

  getStateFromFlux() {
    let shoutStore = this.props.flux.store("shouts"),
      userStoreState = this.props.flux.store("users").getState(),
      shoutStoreState = JSON.parse(JSON.stringify(shoutStore.getState())),
      current = this.props.flux.store("locations").getState().current,
      findRes = shoutStore.findShout(this.props.params.shoutId);

    return {
      shoutId: this.props.params.shoutId,
      shout: findRes.shout || {},
      full: findRes.full,
      loading: shoutStoreState.loading,
      user: userStoreState.user,
      userShouts: userStoreState.shouts,
      relatedShouts: shoutStoreState.relatedShouts,
      replyDrafts: shoutStoreState.replyDrafts,
      current: current
    };
  },

  componentDidUpdate(prevProps, prevState) {
    const {shout, params, flux} = this.props;

    // conditiones are critical to make the transition between shouts and loading extra shouts smoothly happen
    // DO NOT change if you are not sure what exactly is happening
    // setTimeouts are here to prevent action dispatching collide
    // TODO: Refactor later by doing all the tasks in store
    if(prevProps.params.shoutId !== params.shoutId) {
      setTimeout(() => {
        flux.actions.loadShout(params.shoutId);
      },0);
    }

    if(shout.id) {
      if (shout.id !== params.shoutId) {
        setTimeout(() => {
          flux.actions.loadUserShouts(shout.user.username, 'offer', USER_EXTRA_SHOUTS_LIMIT);
          flux.actions.loadRelatedShouts(shout.id);
        },0);
      }
    }

    if(prevState.shout.id !== shout.id){
      setTimeout(() => {
        flux.actions.loadUserShouts(shout.user.username, 'offer', USER_EXTRA_SHOUTS_LIMIT);
        flux.actions.loadRelatedShouts(shout.id);
      },0);
    }

  },

  componentDidMount() {
    const {shout, flux, params} = this.props;
    setTimeout(() => {
      flux.actions.loadShout(params.shoutId);
      if(shout.id) { //happens when loading shout page directly
        flux.actions.loadUserShouts(shout.user.username, 'offer', USER_EXTRA_SHOUTS_LIMIT);
        flux.actions.loadRelatedShouts(shout.id);
      }
    },0);
  },

  render() {
    const {flux, current, shout, loading, userShouts, relatedShouts} = this.props,
      username = shout.id? shout.user.username: null;
    let content, extraShouts = {};

    extraShouts.more = username? userShouts[username]: null;
    extraShouts.related = shout? relatedShouts[shout.id]: null;

    if (shout.id) {
      content =
        <DocumentTitle title={shout.title + " - Shoutit"}>
          <div>
            <ShoutDetailBody shout={shout}
                     current={current}
                     flux={flux}
                     />
            <ShoutExtra extra={extraShouts}
                  creator={shout.user}
                  flux={flux}
                />
          </div>
        </DocumentTitle>;
    } else if (!loading && shout === null) {
      content = (
        <DocumentTitle title={"Not found - Shoutit"}>
          <Grid fluid={true}>
            <h1>Shout not found!</h1>
          </Grid>
        </DocumentTitle>
      );
    } else {
      content = (
        <Grid fluid={true}>
          <Progress/>
        </Grid>
      );
    }

    return (
      <div>
        {content}
      </div>
    );
  }

});
