import Fluxxor from "fluxxor";
import { GET_SUGGESTIONS, GET_SUGGESTIONS_SUCCESS, GET_SUGGESTIONS_FAIL } from "./actionTypes";
import client from "./client";
import { assign } from "lodash/object";
import { kebabCase } from "lodash/string";

var SuggestionsStore = Fluxxor.createStore({
  initialize(props) {
    this.state = {
      data: {}
    };

    if(props.suggestions) {
      // TODO: load suggestions here
    }

    this.bindActions(
      GET_SUGGESTIONS, this.onGetSuggestions,
      GET_SUGGESTIONS_SUCCESS, this.onGetSuggestionsSuccess,
      GET_SUGGESTIONS_FAIL, this.onGetSuggestionsFail
    );
  },

  emptyList() {
    return {
      loading: true,
      list: []
    };
  },

  addEmptyLists(citySlug, dataTypes) {
    dataTypes.forEach((type) => {
      this.state.data[citySlug][type] = new this.emptyList();
    });
  },

  onGetSuggestions({ currentLocation, dataTypes }) {
    const citySlug = kebabCase(currentLocation.city);

    // Initiate empty variable names
    this.addEmptyLists(citySlug, dataTypes);
    this.emit("change");
  },

  onGetSuggestionsSuccess({ res, currentLocation, dataTypes }) {
    this.waitFor(["users", "tags"], () => {
      const citySlug = kebabCase(currentLocation.city);

      // Produce index lists for requested suggestions
      dataTypes.forEach(type => {
        const data = res[type];
        this.state.data[citySlug][type].loading = false;

        switch(type) {
        case "users":
          this.state.data[citySlug][type].list = data.map((item) => item.username);
          break;
        case "shouts":
          this.state.data[citySlug][type].list = data;
          break;
        case "tags":
          this.state.data[citySlug][type].list = data.map((item) => item.name);
          break;
        case "pages":
          this.state.data[citySlug][type].list = data.map((item) => item.username);
          break;
        }
      });

      this.emit("change");
    });
  },

  onGetSuggestionsFail({ currentLocation, dataTypes }) {
    const citySlug = kebabCase(currentLocation.city);

    dataTypes.forEach(type => {
      this.state.data[citySlug][type].loading = false;
    });

    this.emit("change");
  },

  serialize() {
    return JSON.stringify(this.state);
  },

  hydrate(json) {
    this.state = JSON.parse(json);
  },

  getState() {
    return this.state;
  }
});

export default SuggestionsStore;
