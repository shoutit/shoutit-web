import Fluxxor from "fluxxor";

import * as actions from "../actions/actionTypes";

const initialState = {
  currentLocation: null,
  isRetrievingLocation: false,
  error: null,
  locations: {} 
};

export default Fluxxor.createStore({

  initialize() {
    this.state = {...initialState};
    this.bindActions(
      actions.LOGIN_SUCCESS, this.handleLoginSuccess,
      actions.CURRENT_LOCATION_START, this.handleCurrentLocationStart,
      actions.CURRENT_LOCATION_SUCCESS, this.handleCurrentLocationSuccess,
      actions.CURRENT_LOCATION_FAILURE, this.handleCurrentLocationFailure
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

  handleCurrentLocationStart() {
    this.state.isRetrievingLocation = true;
    this.emit("change");
  },

  handleCurrentLocationFailure({ error }) {
    this.state.isRetrievingLocation = false;
    this.state.error = error;
    this.emit("change");
  },

  handleCurrentLocationSuccess(location) {
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
