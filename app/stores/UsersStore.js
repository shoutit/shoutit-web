import Fluxxor from "fluxxor";
import * as actions from "../actions/actionTypes";

const initialState = {
  users: {}
};

export default Fluxxor.createStore({

  initialize() {
    this.state = {...initialState};
    this.bindActions(
      actions.LOGIN_SUCCESS, this.handleLoginSuccess,
      actions.LOAD_SUGGESTIONS_SUCCESS, this.handleLoadSuggestionsSuccess
    );
  },

  get(id) {
    return this.state.users[id];
  },

  getState() {
    return this.state;
  },

  add(user) {
    this.state.users[user.id] = {
      ...this.state.users[user.id],
      ...user
    };
  },

  handleLoginSuccess({ user }) {
    this.add(user);
  },

  handleLoadSuggestionsSuccess({ suggestions }) {
    if (suggestions.users) {
      suggestions.users.forEach(this.add);
      this.emit("change");
    }
  },

  serialize() {
    return JSON.stringify(this.getState());
  },

  hydrate(json) {
    this.state = JSON.parse(json);
  }

});
