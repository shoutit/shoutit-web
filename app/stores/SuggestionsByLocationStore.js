import Fluxxor from 'fluxxor';
import * as actions from '../actions/actionTypes';
import { createLocationSlug } from '../utils/LocationUtils';

const initialState = {
  locations: {},
};

export default Fluxxor.createStore({

  initialize() {
    this.state = { ...initialState };
    this.bindActions(
      actions.LOAD_SUGGESTIONS_START, this.handleLoadStart,
      actions.LOAD_SUGGESTIONS_SUCCESS, this.handleLoadSuccess,
      actions.LOAD_SUGGESTIONS_FAILURE, this.handleLoadFailure
    );
  },

  getState() {
    return this.state;
  },

  get(location) {
    const slug = createLocationSlug(location);
    return this.state.locations[slug];
  },

  getSuggestedShout(location) {
    const ShoutsStore = this.flux.stores.ShoutsStore;
    const suggestions = this.get(location);
    if (!suggestions || !suggestions.shout) {
      return;
    }
    return ShoutsStore.get(suggestions.shout);
  },

  getSuggestedShouts(location) {
    const ShoutsStore = this.flux.stores.ShoutsStore;
    const suggestions = this.get(location);
    if (!suggestions || !suggestions.shouts) {
      return [];
    }
    return suggestions.shouts.map(id => ShoutsStore.get(id));
  },

  getSuggestedTags(location) {
    const TagsStore = this.flux.stores.TagsStore;
    const suggestions = this.get(location);
    if (!suggestions || !suggestions.tags) {
      return [];
    }
    return suggestions.tags.map(id => TagsStore.get(id));
  },

  getSuggestedUsers(location) {
    const UsersStore = this.flux.stores.UsersStore;
    const suggestions = this.get(location);
    if (!suggestions || !suggestions.users) {
      return [];
    }
    return suggestions.users.map(id => UsersStore.get(id));
  },

  shuffle() {
    const { shuffled, categories } = this.state;
    return shuffled.map(slug => categories.find(category => category.slug === slug));
  },

  handleLoadStart({ location }) {
    const slug = createLocationSlug(location);
    this.state.locations[slug] = {
      ...this.state.locations[slug],
      isLoading: true,
    };
    this.emit('change');
  },

  handleLoadFailure({ error, location }) {
    const slug = createLocationSlug(location);
    this.state.locations[slug].isLoading = false;
    this.state.locations[slug].error = error;
    this.emit('change');
  },

  handleLoadSuccess({ suggestions, location }) {
    const slug = createLocationSlug(location);

    const suggestionsById = {};
    const otherStores = [];

    if (suggestions.shouts) {
      suggestionsById.shouts = suggestions.shouts.map(shout => shout.id);
    }
    if (suggestions.shout) {
      suggestionsById.shout = suggestions.shout.id;
    }
    if (suggestions.shout || suggestions.shouts) {
      otherStores.push('ShoutsStore');
    }

    if (suggestions.tags) {
      suggestionsById.tags = suggestions.tags.map(tag => tag.id);
      otherStores.push('TagsStore');
    }
    if (suggestions.users) {
      suggestionsById.users = suggestions.users.map(user => user.id);
      otherStores.push('UsersStore');
    }

    this.state.locations[slug] = {
      ...this.state.locations[slug],
      isLoading: false,
      error: null,
      ...suggestionsById,
    };

    this.waitFor(otherStores, () => {
      this.emit('change');
    });
  },

  serialize() {
    return JSON.stringify(this.getState());
  },

  hydrate(json) {
    this.state = JSON.parse(json);
  },

});
