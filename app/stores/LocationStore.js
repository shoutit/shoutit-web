import Fluxxor from "fluxxor";

import * as actions from "../actions/actionTypes";

const initialState = {
  currentLocation: null,
  isRetrievingLocation: false,
  error: null
};

export default Fluxxor.createStore({

  initialize() {
    this.state = {...initialState};
    this.bindActions(
      actions.LOGIN_SUCCESS, this.handleLoginSuccess,
      actions.CURRENT_LOCATION_START, this.handleLocationStart,
      actions.CURRENT_LOCATION_SUCCESS, this.handleLocationSuccess,
      actions.CURRENT_LOCATION_FAILURE, this.handleLocationFailure
    );
  },

  getState() {
    return this.state;
  },

  getCurrentLocation() {
    return this.state.currentLocation;
  },

  handleLoginSuccess({ user }) {
    if (user.location) {
      this.state.currentLocation = user.location;
      this.emit("change");
    }
  },

  handleLocationStart() {
    this.state.isRetrievingLocation = true;
    this.emit("change");
  },

  handleLocationFailure({ error }) {
    this.state.isRetrievingLocation = false;
    this.state.error = error;
    this.emit("change");
  },

  handleLocationSuccess(location) {
    this.state.isRetrievingLocation = false;
    this.state.currentLocation = location;
    this.emit("change");
  },

  serialize() {
    return JSON.stringify(this.getState());
  },

  hydrate(json) {
    this.state = JSON.parse(json);
  }

});
