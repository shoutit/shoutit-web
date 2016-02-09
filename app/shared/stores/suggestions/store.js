import Fluxxor from "fluxxor";
import consts from "./consts";
import client from "./client";
import assign from "lodash/object/assign";
import {createSlug} from "../../components/helper";

var SuggestionsStore = Fluxxor.createStore({
  initialize(props) {
    this.state = {
      loading: false,
      data: {}
    };

    if(props.suggestions) {
      // TODO: load suggestions here
    }

    this.bindActions(
      consts.GET_SUGGESTIONS, this.onGetSuggestions,
      consts.GET_SUGGESTIONS_SUCCESS, this.onGetSuggestionsSuccess,
      consts.GET_SUGGESTIONS_FAIL, this.onGetSuggestionsFail
    );
  },

  emptyList() {
    return {
      loading: false,
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
    this.state.data[citySlug].shouts.list = data.map((item) => item.id);
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

    this.state.loading = true;
    this.emit("change");
  },

  onGetSuggestionsSuccess({ res, currentLocation }) {
    const {pages, shouts, tags, users} = res;

    // Making slug name for city of the selected location to be used as id in store
    const citySlug = createSlug(currentLocation.city);

    this.addPagesList(citySlug, pages);
    this.addShoutsList(citySlug, shouts);
    this.addTagsList(citySlug, tags);
    this.addUsersList(citySlug, users);

    this.state.loading = false;
    this.emit("change");
  },

  onGetSuggestionsFail() {
    this.state.loading = false;
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
