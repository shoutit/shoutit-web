import Fluxxor from "fluxxor";

import * as actions from "../actions/actionTypes";

const initialState = {
  currencies: {}
};

export default Fluxxor.createStore({

  initialize() {
    this.state = {...initialState};
    this.bindActions(
      actions.LOAD_CURRENCIES_START, this.handleLoadSuccess,
      actions.LOAD_CURRENCIES_SUCCESS, this.handleLoadSuccess,
      actions.LOAD_CURRENCIES_FAILURE, this.handleLoadFailure
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

  handleLoadSuccess(currencies) {
    this.state.currencies = currencies;
    this.emit("change");
  },

  serialize() {
    return JSON.stringify(this.getState());
  },

  hydrate(json) {
    this.state = JSON.parse(json);
  }

});
