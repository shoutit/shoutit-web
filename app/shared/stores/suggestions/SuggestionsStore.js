import Fluxxor from "fluxxor";
import { GET_SUGGESTIONS, GET_SUGGESTIONS_SUCCESS, GET_SUGGESTIONS_FAIL } from "./actionTypes";
import client from "./client";
import assign from "lodash/object/assign";
import {createSlug} from "../../components/helper";

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

  addEmptyLists(citySlug) {
    if(!this.state.data[citySlug]) {
      this.state.data[citySlug] = {
        pages: new this.emptyList(),
        shouts: new this.emptyList(),
        tags: new this.emptyList(),
        users: new this.emptyList()
      };
    }
  },

  addPagesList(citySlug, data) {
    this.state.data[citySlug].pages.list = data.map((item) => item.username);
    this.state.data[citySlug].pages.loading = false;
  },

  addShoutsList(citySlug, data) {
    this.state.data[citySlug].shouts.list = data;
    this.state.data[citySlug].shouts.loading = false;
  },

  addUsersList(citySlug, data) {
    this.state.data[citySlug].users.list = data.map((item) => item.username);
    this.state.data[citySlug].users.loading = false;
  },

  addTagsList(citySlug, data) {
    this.state.data[citySlug].tags.list = data.map((item) => item.name);
    this.state.data[citySlug].tags.loading = false;
  },

  onGetSuggestions({ currentLocation }) {
    const citySlug = createSlug(currentLocation.city);

    // Initiate empty variable names
    this.addEmptyLists(citySlug);
    this.emit("change");
  },

  onGetSuggestionsSuccess({ res, currentLocation }) {
    this.waitFor(["users", "tags"], () => {
      const {pages, shouts, tags, users} = res;

      // Making slug name for city of the selected location to be used as id in store
      const citySlug = createSlug(currentLocation.city);

      this.addPagesList(citySlug, pages);
      this.addShoutsList(citySlug, shouts);
      this.addTagsList(citySlug, tags);
      this.addUsersList(citySlug, users);

      this.emit("change");
    });
  },

  onGetSuggestionsFail({ currentLocation }) {
    const citySlug = createSlug(currentLocation.city);

    // Removing the whole data after fail disable the loadings inside each list easily
    if(this.state.data[citySlug]) {
      delete this.state.data[citySlug];
    }

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
