import React from "react";
import {Grid, Column} from "../helper";
import {StoreWatchMixin} from "fluxxor";
import {ListeningCard, ListenToCard, PagesCard, ProfileCard, TagsCard, SuggestShoutCard} from "../cards";

export default React.createClass({
  mixins: [new StoreWatchMixin("tags")],

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
    const tags = flux.store('tags').getState();

    return {
      tags
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

  render() {
    const {suggestions} = this.props;
    const tagsData = this.getTagsFromStore();

    return (
      <Grid className="homepage-holder">
          <Column size="3" clear={true}>
            <ProfileCard />
            <ListeningCard />
            <PagesCard />
          </Column>
          <Column size="9">
              { React.cloneElement(this.props.children, {flux: this.props.flux}) }
          </Column>
          <Column size="3">
            <TagsCard
              tags={ JSON.parse(JSON.stringify(tagsData)) }
              loading={ suggestions.data && suggestions.data.tags.loading }
            />
            <ListenToCard />
            <SuggestShoutCard />
          </Column>
      </Grid>
    );
  }
});
