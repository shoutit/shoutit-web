import Fluxxor from 'fluxxor';
import * as actions from '../actions/actionTypes';

const initialState = {
  shouts: {},
};

export default Fluxxor.createStore({

  initialize() {
    this.state = { ...initialState };
    this.bindActions(
      actions.LOAD_SUGGESTIONS_SUCCESS, this.handleLoadSuggestionsSuccess
    );
  },

  getState() {
    return this.state;
  },

  get(id) {
    return this.state[id];
  },

  handleLoadSuggestionsSuccess({ suggestions }) {
    if (suggestions.shouts) {
      suggestions.shouts.forEach(shout => {
        this.state.shouts[shout.id] = {
          ...this.state.shouts[shout.id],
          ...shout,
        };
      });
    }
    if (suggestions.shout) {
      this.state.shouts[suggestions.shout.id] = {
        ...this.state.shouts[suggestions.shout.id],
        ...suggestions.shout,
      };
    }
    if (suggestions.shout || suggestions.shouts) {
      this.emit('change');
    }
  },

  serialize() {
    return JSON.stringify(this.getState());
  },

  hydrate(json) {
    this.state = JSON.parse(json);
  },

});
