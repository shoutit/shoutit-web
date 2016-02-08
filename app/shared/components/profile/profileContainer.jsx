import React from 'react';
import {StoreWatchMixin} from "fluxxor";
import {Grid, Column} from '../helper';
import Profile from './profile.jsx';
import {ListenToCard, TagsCard, SuggestShoutCard} from "../cards";

export default React.createClass({
  mixins: [new StoreWatchMixin("users")],

  childContextTypes: {
    flux: React.PropTypes.object,
    params: React.PropTypes.object,
    location: React.PropTypes.object
  },

  statics: {
    fetchId: 'user',
    fetchData(client, session, params) {
      return client.users().get(session, params.username);
    }
  },

  getStateFromFlux() {
    const users = this.props.flux.store("users").getState();
    return JSON.parse(JSON.stringify(users));
  },

  getChildContext() {
    return {
      flux: this.props.flux,
      params: this.props.params,
      location: this.props.location
    };
  },

  render() {
    return (
      <div className="profile-holder">
        <Grid >
          <Column size="12" clear={true}>
            { React.cloneElement(this.props.children, {...this.state}) }
          </Column>
          <Column size="3">
            <TagsCard tags={[]} loading={false}/>
            <ListenToCard />
            <SuggestShoutCard />
          </Column>
        </Grid>
      </div>
    );
  }
});
