import React from "react";
import {Grid, Column} from "../helper";
import {StoreWatchMixin} from "fluxxor";
import {ListeningCard, ListenToCard, ProfileCard, TagsCard, SuggestShoutCard} from "../cards";

export default React.createClass({
  mixins: [new StoreWatchMixin("tags", "users")],

  statics: {
    fetchId: 'suggestions',
    fetchData(client, session, params) {
      return client.misc().suggestions(session, params);
    }
  },

  childContextTypes: {
    flux: React.PropTypes.object,
    params: React.PropTypes.object,
    location: React.PropTypes.object
  },

  getStateFromFlux() {
    const {flux} = this.props;
    const tags = flux.store("tags").getState();
    const users = flux.store("users").getUsersState();
    const listens = flux.store("users").getState().listens;
    const loading = flux.store("users").getState().loading;

    return {
      tags,
      users,
      listens,
      loading
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
    const {flux, currentLocation} = this.props;
    flux.actions.getSuggestions(currentLocation);

    this.loadListeningData();
  },

  componentDidUpdate() {
    this.loadListeningData();
  },

  loadListeningData() {
    const { listens, loading } = this.state;
    const { loggedUser, flux } = this.props;
    if (loggedUser && !loading && !listens[loggedUser.username]) {
      flux.actions.loadUserListening(loggedUser.username);
    }
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
    const {suggestions, flux, loggedUser, displayUINotif} = this.props;
    const tagsData = this.getTagsFromStore();
    const usersData = this.getUsersFromStore();
    const shoutsData = suggestions.data? suggestions.data.shouts.list[0]: null;

    const { listens } = this.state;
    let listening, listeningData;
    if (loggedUser && listens[loggedUser.username]) {
      listening = listens[loggedUser.username].listening.list;
      listeningData = listening.map(item => this.state.users[item]);
    }

    return (
      <Grid>
          <Column size="3" clear={true}>
            <ProfileCard />
            { listeningData &&
              <ListeningCard listening={ listeningData } flux={ flux } displayUINotif={displayUINotif}/>
            }
          </Column>
          <Column size="9">
              { React.cloneElement(this.props.children, {flux: this.props.flux}) }
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
            />
            <SuggestShoutCard
              shout={ shoutsData }
              loading={ suggestions.data && suggestions.data.shouts.loading }
            />
          </Column>
      </Grid>
    );
  }
});
