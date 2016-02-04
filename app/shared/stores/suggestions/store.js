import Fluxxor from "fluxxor";
import consts from "./consts";
import client from "./client";
import assign from "lodash/object/assign";

var SuggestionsStore = Fluxxor.createStore({
  initialize(props) {
      this.state = {
          loading: false,
          pages: {},
          shouts: {},
          tags: {},
          users: {}
        };

      if(props.suggestions) {
            // TODO: load suggestions here
        }

      this.bindActions(
            consts.GET_SUGGESTIONS, this.onGetSuggestions
        );
    },

  createSuggestionList(keyName, loading = false) {
      if(keyName) {
          this.state[keyName] = assign({loading: loading}, {list: []});
        }
    },

  addSuggestionList(collection) {
      for (let keyName in collection) {
          !this.state[keyName] && this.createSuggestionList(keyName);
          this.state[keyName].list = collection[keyName];
        }
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
                  this.addSuggestionList({pages, shouts, tags, users});

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
