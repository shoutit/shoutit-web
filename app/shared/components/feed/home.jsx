import React from "react";
import {Grid, Column} from "../helper";
import {StoreWatchMixin} from "fluxxor";
import {ListeningCard, ListenToCard, PagesCard, ProfileCard, TagsCard, SuggestShoutCard} from "../cards";

export default React.createClass({
  mixins: [new StoreWatchMixin("suggestions")],

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
    const suggestions = flux.store('suggestions').getState();
    const tags = flux.store('tags').getState();

    return {
      suggestions,
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
    console.log(currentLocation);
    this.props.flux.actions.getSuggestions(this.props.currentLocation);
  },

  /**
   * Loading tags objects straight from Tags store
   * @param suggestedTags
   * @returns {Array}
   */
  getTagsFromStore(suggestedTags) {
    const {tags} = this.state.tags;
    return suggestedTags.map((item) => tags[item]);
  },

  render() {
    const {suggestions} = this.state;
    // TODO: bring it back when store support is complete
    //const tagsData = this.getTagsFromStore(suggestions.tags.list);
    const tagsData = [];

    return (
      <Grid className="homepage-holder">
          <Column size="3" clear={true}>
            <ProfileCard />
            <ListeningCard />
            <PagesCard />
          </Column>
          <Column size="9">
              {React.cloneElement(this.props.children, {flux: this.props.flux})}
          </Column>
          <Column size="3">
            <TagsCard tags={tagsData} loading={suggestions.loading || suggestions.tags.loading}/>
            <ListenToCard />
            <SuggestShoutCard />
          </Column>
      </Grid>
    );
  }
});
