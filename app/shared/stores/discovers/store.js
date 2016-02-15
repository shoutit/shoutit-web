import Fluxxor from "fluxxor";
import consts from "./consts";
import defaults from "../../consts/defaults";
import assign from "lodash/object/assign";
import url from "url";

var DiscoverStore = Fluxxor.createStore({
  initialize(props) {
    this.state = {
      loading: false,
      countries: {},
      discovers: {},
      shouts: {}
    };

        // Checking server rendering conditions

    if(props.discoverlist) {
      const {country, results: {id}} = props.discoverlist;
      this.onLoadDiscoverWithCodeSuccess({country, id});
    }

    if(props.discoverid) {
      const res = props.discoverid;
            // TODO: Bring it back after dicoverShouts were also supported by server rendering
            //this.addDiscoverEntry(res.id);
            //this.onLoadDiscoverWithIdSuccess({res , id: res.id});
    }

        // TODO: should be implemented to be fetched in components and routes
    if(props.discoverShouts) {
      const res = props.discoverShouts;

      if(res.show_shouts) {
        this.addDiscoverShoutsEntry(res.id);
        this.state.shouts[res.id].next = this.parseNextPage(res.next);

                // save the list of shouts id in this store
        this.state.shouts[res.id].list = res.results.map((item) => item.id);
      }
    }

    this.bindActions(
            consts.LOAD_DISCOVER_WITH_CODE, this.onLoadDiscoverWithCode,
            consts.LOAD_DISCOVER_WITH_CODE_SUCCESS, this.onLoadDiscoverWithCodeSuccess,
            consts.LOAD_DISCOVER_FAIL, this.onLoadDiscoverFail,
            consts.LOAD_DISCOVER_WITH_ID, this.onLoadDiscoverWithId,
            consts.LOAD_DISCOVER_WITH_ID_SUCCESS, this.onLoadDiscoverWithIdSuccess,
            consts.LOAD_DISCOVER_WITH_ID_FAIL, this.onLoadDiscoverWithIdFail,
            consts.LOAD_DISCOVER_SHOUTS, this.onLoadDiscoverShouts,
            consts.LOAD_DISCOVER_SHOUTS_SUCCESS, this.onLoadDiscoverShoutsSuccess,
            consts.LOAD_DISCOVER_SHOUTS_FAIL, this.onLoadDiscoverShoutsFail
        );
  },

  addDiscoverEntry(id) {
    if(!this.state.discovers[id]) {
      this.state.discovers[id] = {
        loading: false,
        id: null,
        title: null,
        description: null,
        cover: null,
                // An array of objects with discover items
        children: []
      };
    }
  },

  addDiscoverShoutsEntry(id) {
    if(!this.state.shouts[id]) {
      this.state.shouts[id] = {
        loading: false,
        next: null,
                // An array of shouts id (find the shout objects in shout store)
        list: []
      };
    }
  },

  onLoadDiscoverWithCode() {
    this.state.loading = true;
    this.emit("change");
  },

  onLoadDiscoverWithCodeSuccess(payload) {
    const {country, id} = payload;

    this.state.countries[country] = id;
    this.state.loading = false;
    this.emit("change");
  },

  onLoadDiscoverFail() {
    this.state.loading = false;
    this.emit("change");
  },

  onLoadDiscoverWithId({id}) {
    this.addDiscoverEntry(id);
    this.state.discovers[id].loading = true;
    this.emit("change");
  },

  onLoadDiscoverWithIdSuccess(payload) {
    const result = payload.res;
    const {id} = result;

    this.state.discovers[id].id = id;
    this.state.discovers[id].title = result.title;
    this.state.discovers[id].description = result.description;
    this.state.discovers[id].cover = result.cover;

    if(result.show_children) {
      this.state.discovers[id].children = result.children;
    }
        // Pause loading
    this.state.discovers[id].loading = false;
    this.emit("change");
  },

  onLoadDiscoverWithIdFail({id}) {
    delete this.state.discovers[id];
    this.state.discovers[id].loading = false;
    this.emit("change");
  },

  onLoadDiscoverShouts({id}) {
    this.addDiscoverShoutsEntry(id);
    this.state.shouts[id].loading = true;
    this.emit("change");
  },

  onLoadDiscoverShoutsSuccess({id, res}) {
        // Waiting for the shouts store to handle and store the shouts data
    this.waitFor(["shouts"], () => {
      this.state.shouts[id].loading = false;
      this.state.shouts[id].next = this.parseNextPage(res.next);

            // save the list of shouts id in this store
      this.state.shouts[id].list = res.results.map((item) => item.id);
      this.emit("change");
    });
  },

  onLoadDiscoverShoutsFail({id}) {
    this.state.shouts[id].loading = false;
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

export default DiscoverStore;
