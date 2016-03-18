import Fluxxor from "fluxxor";
import shuffle from "lodash/collection/shuffle";

import * as actions from "../actions/actionTypes";

const initialState = {
  categories: {},
  shuffled: []
};

export default Fluxxor.createStore({

  initialize() {
    this.state = {...initialState};
    this.bindActions(
      actions.LOAD_CATEGORIES_START, this.handleLoadStart,
      actions.LOAD_CATEGORIES_SUCCESS, this.handleLoadSuccess,
      actions.LOAD_CATEGORIES_FAILURE, this.handleLoadFailure
    );
  },

  get() {
    return this.state.categories;
  },

  getState() {
    return this.state;
  },

  getCurrentLocation() {
    return this.state.currentLocation;
  },

  shuffle() {
    return this.state.shuffled.map(slug =>
      this.state.categories.find(category => category.slug === slug)
    );
  },

  handleLoadStart() {
    this.state.isLoading = true;
    this.emit("change");
  },

  handleLoadFailure({ error }) {
    this.state.isLoading = false;
    this.state.error = error;
    this.emit("change");
  },

  handleLoadSuccess(categories) {
    this.state.categories = categories;
    this.state.shuffled = shuffle(categories.map(category => category.slug));
    this.emit("change");
  },

  serialize() {
    return JSON.stringify(this.getState());
  },

  hydrate(json) {
    this.state = JSON.parse(json);
  }

});
