import React from 'react';
import {StoreWatchMixin} from "fluxxor";
import {Grid, Column} from "../helper";
import {ListenToCard, TagsCard, SuggestShoutCard, TagProfileCard, RelatedTagsCard} from "../cards";

export default React.createClass({
  mixins: [new StoreWatchMixin("tags")],

  statics: {
    fetchId: 'tag',
    fetchData(client, session, params) {
      return client.tags().get(session, params.tagName);
    }
  },

  getStateFromFlux() {
    return this.props.flux.store("tags").getState();
  },

  loadTag() {
    const {params, flux} = this.props,
      tagName = params.tagName,
      tagEntry = this.state.tags[tagName];

    if (!this.state.loading && !tagEntry && tagEntry !== null) {
      flux.actions.loadTag(tagName);
    }
  },

  componentDidMount() {
    this.loadTag();
  },

  componentDidUpdate() {
    this.loadTag();
  },

  render() {
    const {params, flux} = this.props;
    return (
      <Grid >
        <Column size="3">
          <TagProfileCard params={params} flux={flux} {...this.state}/>
          <RelatedTagsCard />
        </Column>
        <Column size="9" clear={true}>
          { React.cloneElement(this.props.children, {...this.state}) }
        </Column>
        <Column size="3">
          <TagsCard tags={[]} loading={false}/>
          <ListenToCard />
          <SuggestShoutCard />
        </Column>
      </Grid>
    );
  }
});
