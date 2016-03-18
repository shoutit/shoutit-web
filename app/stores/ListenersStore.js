import Fluxxor from "fluxxor";

import * as actions from "../actions/actionTypes";

const initialState = {
  users: {}
};

export default Fluxxor.createStore({

  initialize() {
    this.state = {...initialState};
    this.bindActions(
      actions.LOAD_LISTENERS_START, this.handleLoadStart,
      actions.LOAD_LISTENERS_SUCCESS, this.handleLoadSuccess,
      actions.LOAD_LISTENERS_FAILURE, this.handleLoadFailure
    );
  },

  getState() {
    return this.state;
  },

  get(id) {
    return this.state.users[id];
  },

  getListeners(userId) {
    const UsersStore = this.flux.stores.UsersStore;
    return this.get(userId).listeners.map(id => UsersStore.get(id));
  },

  handleLoadStart({ user }) {
    this.state.users[user.id] = {
      ...this.state.users[user.id],
      isLoading: true
    };
    this.emit("change");
  },

  handleLoadFailure({ error, user }) {
    this.state.users[user.id] = {
      ...this.state.users[user.id],
      isLoading: false,
      error
    };
    this.emit("change");
  },

  handleLoadSuccess({ results, user }) {
    this.state.users[user.id] = {
      ...this.state.users[user.id],
      isLoading: false,
      error: null,
      listeners: results.map(user => user.id)
    };
    this.waitFor(["UsersStore"], () => this.emit("change"));
  },

  serialize() {
    return JSON.stringify(this.getState());
  },

  hydrate(json) {
    this.state = JSON.parse(json);
  }

});
