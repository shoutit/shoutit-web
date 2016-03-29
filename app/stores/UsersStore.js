import Fluxxor from 'fluxxor';
import * as actions from '../actions/actionTypes';

const initialState = {
  users: {}
};

export default Fluxxor.createStore({

  initialize() {
    this.state = { ...initialState };
    this.bindActions(
      actions.LOGIN_SUCCESS, this.handleLoginSuccess,
      actions.LOAD_LISTENING_SUCCESS, this.handleListening,
      actions.LOAD_LISTENERS_SUCCESS, this.handleListeners,
      actions.LOAD_SUGGESTIONS_SUCCESS, this.handleSuggestions
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

  handleSuggestions({ suggestions }) {
    if (suggestions.users) {
      suggestions.users.forEach(this.add);
      this.emit('change');
    }
  },

  handleListening({ users }) {
    users.forEach(this.add);
    this.emit('change');
  },

  handleListeners({ results }) {
    results.forEach(this.add);
    this.emit('change');
  },

  serialize() {
    return JSON.stringify(this.getState());
  },

  hydrate(json) {
    this.state = JSON.parse(json);
  }

});
