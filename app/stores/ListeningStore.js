import Fluxxor from 'fluxxor';

import * as actions from '../actions/actionTypes';

const initialState = {
  users: {}
};

export default Fluxxor.createStore({

  initialize() {
    this.state = { ...initialState };
    this.bindActions(
      actions.LOGIN_SUCCESS, this.handleLogin,
      actions.LOAD_LISTENING_START, this.handleLoadStart,
      actions.LOAD_LISTENING_SUCCESS, this.handleLoadSuccess,
      actions.LOAD_LISTENING_FAILURE, this.handleLoadFailure
    );
  },

  getState() {
    return this.state;
  },

  get(id) {
    return this.state.users[id];
  },

  getListening(id) {
    const { UsersStore, TagsStore } = this.flux.stores;
    if (!this.get(id)) {
      return { users: [], tags: [] };
    }
    const { users, tags } = this.get(id);
    return {
      users: users ? users.map(userId => UsersStore.get([userId])) : [],
      tags: tags ? tags.map(tagId => TagsStore.get([tagId])) : []
    };
  },

  handleLogin({ user }) {
    this.state.users[user.id] = {
      users: [],
      tags: [],
      ...this.state.users[user.id]
    };
    this.emit('change');
  },

  handleLoadStart({ user }) {
    this.state.users[user.id] = {
      ...this.state.users[user.id],
      isLoading: true
    };
    this.emit('change');
  },

  handleLoadFailure({ error, user }) {
    this.state.users[user.id] = {
      ...this.state.users[user.id],
      isLoading: false,
      error
    };
    this.emit('change');
  },

  handleLoadSuccess({ users, tags, user }) {
    this.state.users[user.id] = {
      ...this.state.users[user.id],
      isLoading: false,
      error: null
    };
    if (users) {
      this.state.users[user.id].users = users.map(user => user.id);
      this.waitFor(['UsersStore'], () => this.emit('change'));
    } else if (tags) {
      this.state.users[user.id].tags = tags.map(tag => tag.id);
      this.waitFor(['TagsStore'], () => this.emit('change'));
    }
  },

  serialize() {
    return JSON.stringify(this.getState());
  },

  hydrate(json) {
    this.state = JSON.parse(json);
  }

});
