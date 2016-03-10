import React from 'react';
import {StoreWatchMixin} from "fluxxor";
import {Grid, Column} from '../helper';
import Profile from './profile.jsx';
import {ListenToCard, TagsCard, SuggestShoutCard} from "../cards";
import { assign } from "lodash";

export default React.createClass({
  mixins: [new StoreWatchMixin("tags", "users")],

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
    const {flux} = this.props;
    const tags = flux.store("tags").getState();
    const users = flux.store("users").getState();

    return {
      tags,
      users
    };
  },

  getChildContext() {
    return {
      flux: this.props.flux,
      params: this.props.params,
      location: this.props.location
    };
  },

  componentDidMount() {
    this.loadSuggestions();
  },

  componentDidUpdate(prevProps) {
    if(prevProps.location.pathname !== this.props.location.pathname) {
      this.loadSuggestions();
    }
  },

  loadSuggestions() {
    const { flux, currentLocation } = this.props;
    flux.actions.getSuggestions(currentLocation, ["tags", "users", "shouts"]);
  },

  /**
   * Loading tags objects straight from Tags store
   * @returns {Array}
   */
  getTagsFromStore() {
    const {suggestions} = this.props;
    const {tags} = this.state.tags;

    if(suggestions.data) {
      return suggestions.data.tags.list.map((item) => tags[item] && tags[item].tag);
    } else {
      return [];
    }
  },

  getUsersFromStore() {
    const {suggestions} = this.props;
    const {users} = this.state.users;

    if(suggestions.data) {
      return suggestions.data.users.list.map((item) => users[item]);
    } else {
      return [];
    }
  },

  render() {
    const { suggestions, flux, currentLocation } = this.props;
    const tagsData = this.getTagsFromStore();
    const usersData = this.getUsersFromStore();
    const shoutsData = suggestions.data? suggestions.data.shouts.list[0]: null;

    return (
      <div className="profile-holder">
        <Grid >
          <Column size="12" clear={true}>
            { React.cloneElement(this.props.children, { ...this.state.users, currentLocation }) }
          </Column>
          <Column size="3">
            <TagsCard
              flux={flux}
              tags={ JSON.parse(JSON.stringify(tagsData)) }
              loading={ suggestions.data && suggestions.data.tags.loading }
            />
            <ListenToCard
              flux={flux}
              users={ usersData }
              loading={ suggestions.data && suggestions.data.users.loading }
              currentLocation={ currentLocation }
            />
            <SuggestShoutCard
              shout={ shoutsData }
              loading={ suggestions.data && suggestions.data.shouts.loading }
            />
          </Column>
        </Grid>
      </div>
    );
  }
});
