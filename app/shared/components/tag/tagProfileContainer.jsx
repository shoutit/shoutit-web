import React from 'react';
import {StoreWatchMixin} from "fluxxor";
import {Grid, Column} from "../helper";
import {ListenToCard, TagsCard, SuggestShoutCard, TagProfileCard, RelatedTagsCard} from "../cards";

export default React.createClass({
  mixins: [new StoreWatchMixin("tags", "users")],

  statics: {
    fetchId: 'tag',
    fetchData(client, session, params) {
      return client.tags().get(session, params.tagName);
    }
  },

  getStateFromFlux() {
    const {flux} = this.props;
    const tags = flux.store("tags").getState();
    const users = flux.store("users").getUsersState();

    return {
      tags,
      users
    };
  },

  loadTag() {
    const {params, flux} = this.props,
      tagName = params.tagName,
      tagEntry = this.state.tags.tags[tagName];

    if (!this.state.tags.loading && !tagEntry && tagEntry !== null) {
      flux.actions.loadTag(tagName);
    }
    if(tagEntry && !tagEntry.related.loading && !tagEntry.related.list.length) {
      flux.actions.loadTagRelated(tagName);
    }
  },

  componentDidMount() {
    this.loadTag();
  },

  componentDidUpdate(prevProps) {
    this.loadTag();
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
    const {suggestions, flux, params} = this.props;
    const tagsData = this.getTagsFromStore();
    const usersData = this.getUsersFromStore();
    const shoutsData = suggestions.data? suggestions.data.shouts.list[0]: null;

    const { tagName } = params;
    // Avoiding mutation problems in store
    const clonedTags = JSON.parse(JSON.stringify(this.state.tags.tags));

    const tag = clonedTags[tagName];
    // Reading the list of related tags name and converting them to full tag objects
    const relatedTagsData = tag? tag.related.list.map(item => clonedTags[item].tag): [];

    return (
      <Grid >
        <Column size="3" clear={true}>
          <TagProfileCard params={params} flux={flux} {...this.state.tags}/>
          <RelatedTagsCard
            tags={ relatedTagsData }
            loading={ tag && tag.related.loading }
            flux={ flux }
          />
        </Column>
        <Column size="9">
          { React.cloneElement(this.props.children, { ...this.state.tags, tagName }) }
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
