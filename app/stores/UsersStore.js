import Fluxxor from "fluxxor";
import * as actions from "../actions/actionTypes";

const initialState = {
  users: {}
};

export default Fluxxor.createStore({

  initialize() {
    this.state = {...initialState};
    this.bindActions(
      actions.LOAD_SUGGESTIONS_SUCCESS, this.handleLoadSuggestionsSuccess
    );
  },

  getState() {
    return this.state;
  },

  handleLoadSuggestionsSuccess({ suggestions }) {
    if (suggestions.users) {
      suggestions.users.forEach(user => {
        this.state.users[user.id] = {
          ...this.state.users[user.id],
          ...user
        };
      });
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
