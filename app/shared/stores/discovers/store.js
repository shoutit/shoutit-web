import Fluxxor from 'fluxxor';
import consts from './consts';
import defaults from '../../consts/defaults';
import assign from 'lodash/object/assign';

var DiscoverStore = Fluxxor.createStore({
    initialize(props) {
        this.state = {
            loading: false,
            countries: {},
            discovers: {},
            shouts: {}
        };

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
        if(!this.state.discover[id]) {
            this.state.discovers[id] = {
                loading: false,
                err: null,
                // An array of objects with discover items
                children: []
            };
        }
    },

    addDiscoverShoutsEntry(id) {
        if(!this.state.shouts[id]) {
            this.state.shouts[id] = {
                loading: false,
                // An array of shouts id (find the shout objects in shout store)
                list: []
            }
        }
    },

    onLoadDiscoverWithCode() {
        this.state.loading = true;
        this.emit("change");
    },

    onLoadDiscoverWithCodeSuccess(payload) {
        const {country, id} = payload;

        this.state.country[country] = id;
        this.state.loading = false;
        this.emit("change");
    },

    onLoadDiscoverFail() {
        this.state.loading = false;
        this.emit("change");
    },

    onLoadDiscoverWithId(id) {
        this.addDiscoverEntry(id);
        this.state.discovers[id].loading = true;
        this.emit("change");
    },

    onLoadDiscoverWithIdSuccess(payload) {
        const result = payload.res;
        if(result.show_children) {
            this.state.discovers[id].children = result.children;
        }
        // Pause loading
        this.state.discovers[id].loading = false;
        this.emit("change");
    },

    onLoadDiscoverWithIdFail({id}) {
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
        this.waitFor(['shouts'], () => {
            this.state.shouts[id].loading = false;
            // save the list of shouts id in this store
            this.state.shouts[id].list = res.map((item) => item.id);
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
