import Fluxxor from "fluxxor";

import * as actions from "../actions/actionTypes";

const initialState = {
  categories: {}
};

export default Fluxxor.createStore({

  initialize() {
    this.state = {...initialState};
    this.bindActions(
      actions.LOAD_CATEGORIES_START, this.handleLoadSuccess,
      actions.LOAD_CATEGORIES_SUCCESS, this.handleLoadSuccess,
      actions.LOAD_CATEGORIES_FAILURE, this.handleLoadFailure
    );
  },

  getState() {
    return this.state;
  },

  getCurrentLocation() {
    return this.state.currentLocation;
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
    this.emit("change");
  },

  serialize() {
    return JSON.stringify(this.getState());
  },

  hydrate(json) {
    this.state = JSON.parse(json);
  }

});
