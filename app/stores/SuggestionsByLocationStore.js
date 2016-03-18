import Fluxxor from "fluxxor";
import * as actions from "../actions/actionTypes";
import { createLocationSlug } from "../utils/LocationUtils";

const initialState = {
  locations: {}
};

export default Fluxxor.createStore({

  initialize() {
    this.state = {...initialState};
    this.bindActions(
      actions.LOAD_SUGGESTIONS_START, this.handleLoadStart,
      actions.LOAD_SUGGESTIONS_SUCCESS, this.handleLoadSuccess,
      actions.LOAD_SUGGESTIONS_FAILURE, this.handleLoadFailure
    );
  },

  getState() {
    return this.state;
  },

  getSuggestions(location) {
    return this.state.currentLocation(location);
  },

  shuffle() {
    return this.state.shuffled.map(slug =>
      this.state.categories.find(category => category.slug === slug)
    );
  },

  handleLoadStart({ location }) {
    const slug = createLocationSlug(location);
    this.state.locations[slug] = {
      ...this.state.locations[slug],
      isLoading: true
    };
    this.emit("change");
  },

  handleLoadFailure({ error, location }) {
    const slug = createLocationSlug(location);
    this.state.locations[slug].isLoading = false;
    this.state.locations[slug].error = error;
    this.emit("change");
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
      otherStores.push("ShoutsStore");
    }

    if (suggestions.tags) {
      suggestionsById.tags = suggestions.tags.map(tag => tag.id);
      otherStores.push("TagsStore");
    }
    if (suggestions.users) {
      suggestionsById.users = suggestions.users.map(user => user.id);
      otherStores.push("UsersStore");
    }

    this.state.locations[slug] = {
      ...this.state.locations[slug],
      isLoading: false,
      error: null,
      ...suggestionsById
    };

    this.waitFor(otherStores, () => {
      this.emit("change");
    });

  },

  serialize() {
    return JSON.stringify(this.getState());
  },

  hydrate(json) {
    this.state = JSON.parse(json);
  }

});
