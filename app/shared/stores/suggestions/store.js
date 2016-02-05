import Fluxxor from "fluxxor";
import consts from "./consts";
import client from "./client";
import assign from "lodash/object/assign";

var SuggestionsStore = Fluxxor.createStore({
  initialize(props) {
    this.state = {
      loading: false,
      pages: new this.emptyList(),
      shouts: new this.emptyList(),
      tags: new this.emptyList(),
      users: new this.emptyList()
    };

    if(props.suggestions) {
      // TODO: load suggestions here
    }

    this.bindActions(
      consts.GET_SUGGESTIONS, this.onGetSuggestions
    );
  },

  emptyList() {
    return {
      loading: false,
      list: []
    };
  },

  addPagesList(data) {
    this.state.pages.list = data.map((item) => item.username);
    this.state.pages.loading = false;
    this.emit("change");
  },

  addShoutsList(data) {
    this.state.shouts.list = data.map((item) => item.id);
    this.state.shouts.loading = false;
    this.emit("change");
  },

  addUsersList(data) {
    this.state.users.list = data.map((item) => item.username);
    this.state.users.loading = false;
    this.emit("change");
  },

  addTagsList(data) {
    this.state.tags.list = data.map((item) => item.name);
    this.state.tags.loading = false;
    this.emit("change");
  },

  onGetSuggestions(payload) {
    // TODO: should get location for logged user from their profile for server rendering
    // It is happening now but we need it before onComponentDidMount
    const location = this.flux.store("locations").getState().current;

    client.getSuggestions({
      country: location.country,
      state: location.state,
      city: location.city,
      page_size: 8
    }).end((err, res) => {
      if(err) {
        console.error(err);
      } else {
        const {pages, shouts, tags, users} = res.body;
        this.addPagesList(pages);
        this.addShoutsList(shouts);
        this.addTagsList(tags);
        this.addUsersList(users);

        this.state.loading = false;

        this.emit("change");
      }
    });

    this.state.loading = true;
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
