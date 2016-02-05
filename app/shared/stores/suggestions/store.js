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
