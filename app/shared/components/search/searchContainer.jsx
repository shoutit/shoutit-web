import React from 'react';
import {StoreWatchMixin} from "fluxxor";
import {Grid, Column} from "../helper";
import {ListenToCard, InterestsCard, SuggestShoutCard, TagProfileCard, SearchCard} from "../cards";

export default React.createClass({
  mixins: [new StoreWatchMixin("tags", "users", "search")],

  statics: {
    fetchId: "searchShouts",
    fetchData(client, session, params, name, queries) {
      return client.shouts().list(session, {
        search: params.term,
        category: params.category,
        shout_type: params.shouttype,
        city: queries.city,
        country: queries.country
      });
    }
  },

  getStateFromFlux() {
    const {flux} = this.props;
    const tags = flux.store("tags").getState();
    const users = flux.store("users").getUsersState();
    const search = flux.store("search").getState();
    const searchKeyword = flux.store("search").getSearchKeyword();

    return {
      tags,
      users,
      search,
      searchKeyword
    };
  },

  componentDidMount() {
    this.loadSuggestions();
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
    const { suggestions, flux, params, location, currentLocation } = this.props;
    const { searchKeyword } = this.state;

    const tagsData = this.getTagsFromStore();
    const usersData = this.getUsersFromStore();
    const shoutsData = suggestions.data? suggestions.data.shouts.list[0]: null;

    return (
      <Grid >
        <Column size="3" clear={true}>
          <SearchCard
            params={ params }
            flux={ flux }
            location={ location }
            currentLocation={ currentLocation }
            searchKeyword={ searchKeyword }
          />
        </Column>
        <Column size="9">
          { React.cloneElement(this.props.children, { ...this.state, currentLocation}) }
        </Column>
        <Column size="3">
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
        </Column>
      </Grid>
    );
  }
});
