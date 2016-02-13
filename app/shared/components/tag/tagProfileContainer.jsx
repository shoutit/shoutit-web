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
    if(tagEntry && !tagEntry.related.loading && !tagEntry.related.list.length) {
      flux.actions.loadTagRelated(tagName);
    }
  },

  componentDidMount() {
    this.loadTag();
  },

  componentDidUpdate() {
    this.loadTag();
  },

  render() {
    const { params, flux } = this.props;
    const { tagName } = params;
    // Avoiding mutation problems in store
    const clonedTags = JSON.parse(JSON.stringify(this.state.tags));

    const tag = clonedTags[tagName];
    // Reading the list of related tags name and converting them to full tag objects
    const relatedTagsData = tag? tag.related.list.map(item => clonedTags[item].tag): [];

    return (
      <Grid >
        <Column size="3" clear={true}>
          <TagProfileCard params={params} flux={flux} {...this.state}/>
          <RelatedTagsCard
            tags={ relatedTagsData }
            loading={ tag && tag.related.loading }
            flux={ flux }
          />
        </Column>
        <Column size="9">
          { React.cloneElement(this.props.children, { ...this.state, tagName }) }
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
