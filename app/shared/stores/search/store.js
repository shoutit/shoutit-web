import Fluxxor from "fluxxor";
import consts from "./consts";
import url from "url";
import defaults from "../../consts/defaults";
import assign from "lodash/object/assign";

const SHOUT_SEARCH = "shouts";
const TAG_SEARCH = "tags";
const USER_SEARCH = "users";

var clients = {};
clients[SHOUT_SEARCH] = require("../shouts/client");
clients[USER_SEARCH] = require("../users/client");
clients[TAG_SEARCH] = require("../tags/client");


var SearchStore = Fluxxor.createStore({
  initialize(props) {
      this.state = {};
      this.state[SHOUT_SEARCH] = [];
      this.state[USER_SEARCH] = [];
      this.state[TAG_SEARCH] = [];
      this.state.reqs = {};
      this.state.reqs[SHOUT_SEARCH] = null;
      this.state.reqs[USER_SEARCH] = null;
      this.state.reqs[TAG_SEARCH] = null;
      this.state.searching = {};
      this.state.searching[SHOUT_SEARCH] = false;
      this.state.searching[USER_SEARCH] = false;
      this.state.searching[TAG_SEARCH] = false;
      this.state.settings = {};

      if (props.categories) {
          this.state.categories = props.categories;
        }

      if (props.searchShouts) {
          this.state[SHOUT_SEARCH] = props.searchShouts.results;
        }

      if (props.searchUsers) {
          this.state[USER_SEARCH] = props.searchUsers.results;
        }

      if (props.searchTags) {
          this.state[TAG_SEARCH] = props.searchTags.results;
        }

      this.searchShouts = this.onSearch(SHOUT_SEARCH);
      this.searchTags = this.onSearch(TAG_SEARCH);
      this.searchUsers = this.onSearch(USER_SEARCH);

      this.bindActions(
            consts.SEARCH_SHOUTS, this.searchShouts,
            consts.SEARCH_TAGS, this.searchTags,
            consts.SEARCH_USERS, this.searchUsers,
            consts.SEARCH_ALL, this.onSearchAll,
            consts.SEARCH_LOAD_MORE, this.onLoadMore
        );
    },

  onSearchAll(payload) {
      this.searchShouts(payload);
      this.searchTags(payload);
      this.searchUsers(payload);
    },

  onSearch(type) {
      var onCancel = this.onSearchCancel(type),
          onSuccess = this.onSearchSuccess(type);

      return function (payload) {
          let searchQuery = {};
          onCancel();
            // sync-ing app's internal data with API acceptable properties
          if(type === SHOUT_SEARCH) {
              searchQuery = {
                  page_size: defaults.PAGE_SIZE,
                  search: payload.term,
                  shout_type: payload.shouttype !== defaults.ALL_TYPE? payload.shouttype: undefined,
                  category: payload.category !== defaults.ALL_TYPE? payload.category: undefined,
                  tags: payload.tags || undefined,
                  min_price: payload.min || undefined,
                  max_price: payload.max || undefined,
                  country: payload.country || undefined,
                  city: payload.city || undefined
                };
            } else {
                // only term for tags and user search
              searchQuery = {
                  page_size: defaults.PAGE_SIZE,
                  search: payload.term
                };
            }

            // saving search settings
          this.state.settings = searchQuery;

          let searchReq = clients[type].list(searchQuery);
          searchReq.end(function (err, res) {
              this.state.reqs[type] = null;
              this.state.searching[type] = false;
              this.emit("change");
              if (err) {
                  console.log(err);
                } else {
                  onSuccess(res.body);
                }
            }.bind(this));

          this.state.reqs[type] = searchReq;
          this.state.searching[type] = true;
          this.emit("change");
        }.bind(this);
    },

  onSearchCancel(type) {
      return function () {
          if (this.state.reqs[type] && this.state.reqs[type].abort) {
              this.state.reqs[type].abort();
              this.state.reqs[type] = null;
              this.state.searching[type] = false;
              this.emit("change");
            }
        }.bind(this);
    },

  onSearchSuccess(type) {
      return function (data) {
          this.state[type] = data.results;
            // keeping next page number in settings
          this.state.settings.page = data.next? this.parseNextPage(data.next): undefined;
          this.emit("change");
        }.bind(this);
    },

  onLoadMore() {
      let collection = this.state[SHOUT_SEARCH];
      let settings = this.state.settings;

      if (settings.page) {
          let searchReq = clients[SHOUT_SEARCH].list(settings);
          searchReq.end((err, res) => {
              this.state.searching[SHOUT_SEARCH] = false;
              this.emit("change");
              if (err) {
                  console.log(err);
                } else {
                  this.onLoadMoreSuccess(res.body);
                }
            });

          this.state.searching[SHOUT_SEARCH] = true;
          this.emit("change");
        }
    },

  onLoadMoreSuccess(data) {
      let stock = this.state[SHOUT_SEARCH];
        // combining arrays using ES6 spread operator
      stock = [...stock, ...data.results];
      this.state[SHOUT_SEARCH] = stock;

        // only keeping next number
      this.state.settings.page = data.next? this.parseNextPage(data.next): undefined;
      this.emit("change");
    },

  parseNextPage(nextUrl) {
      if (nextUrl) {
          let parsed = url.parse(nextUrl, true);
          return Number(parsed.query.page);
        }
      return null;
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

export default SearchStore;
