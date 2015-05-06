import Fluxxor from 'fluxxor';
import consts from './consts';

const SHOUT_TYPE = "shouts";
const TAG_TYPE = "tags";
const USER_TYPE = "users";

var clients = {};
clients[SHOUT_TYPE] = require('../shouts/client');
clients[USER_TYPE] = require('../users/client');
clients[TAG_TYPE] = require('../tags/client');


var SearchStore = Fluxxor.createStore({
    initialize(props) {
        this.state = {};
        this.state[SHOUT_TYPE] = {};
        this.state[USER_TYPE] = {};
        this.state[TAG_TYPE] = {};
        this.state.reqs = {};
        this.state.reqs[SHOUT_TYPE] = null;
        this.state.reqs[USER_TYPE] = null;
        this.state.reqs[TAG_TYPE] = null;
        this.state.searching = {};
        this.state.searching[SHOUT_TYPE] = false;
        this.state.searching[USER_TYPE] = false;
        this.state.searching[TAG_TYPE] = false;

        if (props.searchShouts && props.term) {
            this.state.shouts[props.term] = props.searchShouts.results;
        }

        if (props.searchUsers && props.term) {
            this.state.users[props.term] = props.searchUsers.results;
        }

        if (props.searchTags && props.term) {
            this.state.users[props.term] = props.searchTags.results;
        }

        this.searchShouts = this.onSearch(SHOUT_TYPE);
        this.searchTags = this.onSearch(TAG_TYPE);
        this.searchUsers = this.onSearch(USER_TYPE);

        this.bindActions(
            consts.SEARCH_SHOUTS, this.searchShouts,
            consts.SEARCH_TAGS, this.searchTags,
            consts.SEARCH_USERS, this.searchUsers,
            consts.SEARCH_ALL, this.onSearchAll
        );
    },

    onSearchAll(payload) {
        this.searchShouts(payload);
        this.searchTags(payload);
        this.searchUsers(payload);
    },

    onSearch(type) {
        var cancelFn = this.onSearchCancel(type),
            successFn = this.onSearchSuccess(type);

        return function (payload) {
            var term = payload.term;

            // No Search for search Terms less than 3 characters.
            if (term.length < 2) {
                return;
            }

            cancelFn();

            var searchReq = clients[type].list({
                search: term
            });

            searchReq.end(function (err, res) {
                this.state.reqs[type] = null;
                this.state.searching[type] = false;
                this.emit("change");
                if (err) {
                    console.log(err);
                } else {
                    successFn({
                        term: term,
                        res: res.body
                    });
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
        return function (payload) {
            this.state[type][payload.term] = payload.res.results;
            this.emit("change");
        }.bind(this);
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
