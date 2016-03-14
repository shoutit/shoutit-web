import React from 'react';
import {StoreWatchMixin} from "fluxxor";
import {Grid, Column} from '../helper';
import { SideFooterCard, ListenToCard, InterestsCard, SuggestShoutCard, ShareShoutCard, ShoutOwnerCard } from "../cards";
import ContactOwnerCard from "../cards/ContactOwnerCard.jsx";

export default React.createClass({
  mixins: [new StoreWatchMixin("shouts", "locations", "users", "tags")],

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
    const tags = flux.store("tags").getState();
    const shoutStore = flux.store("shouts"),
      userStoreState = flux.store("users").getState(),
      shoutStoreState = JSON.parse(JSON.stringify(shoutStore.getState())),
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
      tags
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
    const {users} = this.state;

    if(suggestions.data) {
      return suggestions.data.users.list.map((item) => users[item]);
    } else {
      return [];
    }
  },

  render() {
    const {suggestions, flux, loggedUser, currentLocation } = this.props;
    const tagsData = this.getTagsFromStore();
    const usersData = this.getUsersFromStore();
    const shoutsData = suggestions.data? suggestions.data.shouts.list[0]: null;

    const { shout, users } = this.state;
    return (
      <Grid className="profile-holder">
        <Column size="3" clear={true}>
          { shout &&
            <ShareShoutCard loggedUser={ loggedUser } shout={ shout }/>
          }
        </Column>
        <Column size="9">
          { React.cloneElement(this.props.children, {...this.state, currentLocation}) }
        </Column>
        <Column size="3">
          <ShoutOwnerCard
            loggedUser={loggedUser}
            shout={ shout }
            users={ users }
            flux={ flux }
            />
          {shout.id && loggedUser && shout.user.username !== loggedUser.username &&
            <ContactOwnerCard
              shout={ shout }
              getMobileNumber={ flux.actions.getMobileNumber }
              />
          }
          <InterestsCard
            flux={flux}
            tags={ JSON.parse(JSON.stringify(tagsData)) }
            loading={ suggestions.data && suggestions.data.tags.loading }
            countryCode={ currentLocation.country }
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
          <SideFooterCard />
        </Column>
      </Grid>
    );
  }
});
