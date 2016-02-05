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
    const {flux} = this.context;
    const suggestions = flux.store('suggestions').getState();

    return {
      suggestions
    }
  },

  getChildContext() {
    return {
      flux: this.props.flux,
      params: this.props.params,
      location: this.props.location
    };
  },

  componentDidMount() {
    this.props.flux.actions.getSuggestions();
  },

  render() {
    const {suggestions} = this.state;

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
            <TagsCard />
            <ListenToCard />
            <SuggestShoutCard />
          </Column>
      </Grid>
    );
  }
});
