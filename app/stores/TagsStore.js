import Fluxxor from "fluxxor";
import * as actions from "../actions/actionTypes";

const initialState = {
  tags: {}
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
    if (suggestions.tags) {
      suggestions.tags.forEach(tag => {
        this.state.tags[tag.id] = {
          ...this.state.tags[tag.id],
          ...tag
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
