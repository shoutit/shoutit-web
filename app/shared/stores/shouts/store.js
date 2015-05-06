import findIndex from 'lodash/array/findIndex';
import Fluxxor from 'fluxxor';
import url from 'url';

import consts from './consts';
import client from './client';

const PAGE_SIZE = 5;

var ShoutStore = Fluxxor.createStore({
    initialize(props) {
        this.state = {
            shouts: [],
            nextPage: null,
            maxCount: null,
            fullShouts: {},
            loading: false
        };

        if (props.home) {
            this.state.shouts = props.home.results;
            this.state.maxCount = Number(props.home.count);
            if (props.home.next) {
                this.state.nextPage = this.parseNextPage(props.home.next);
            }
        }

        if (props.shout) {
            this.state.fullShouts[props.shout.id] = props.shout;
        }

        this.bindActions(
            consts.UPDATE, this.onUpdate,
            consts.UPDATE_SUCCESS, this.onUpdateSuccess,
            consts.LOAD_MORE, this.onLoadMore,
            consts.LOAD_MORE_SUCCESS, this.onLoadMoreSuccess,
            consts.REQUEST_FAILED, this.onReqFailed,
            consts.LOAD_SHOUT, this.onLoadShout,
            consts.LOAD_SHOUT_SUCCESS, this.onLoadShoutSuccess
        );
    },

    parseNextPage(nextUrl) {
        if (url) {
            var parsed = url.parse(nextUrl);
            return Number(parsed.query.page);
        }
        return null;
    },

    onReqFailed(err) {
        console.error(err);
    },

    onUpdate() {
        client.list({
            page_size: PAGE_SIZE
        }).end(function (err, res) {
            if (err || !res.body) {
                this.flux.actions.requestFailed(err);
            } else {
                this.flux.actions.updateSuccess(res.body);
            }
        }.bind(this));
    },

    onUpdateSuccess(payload) {
        this.state.shouts = payload.res.results;
        this.state.maxCount = Number(payload.res.count);
        if (payload.res.next) {
            this.state.nextPage = this.parseNextPage(payload.res.next);
        } else {
            this.state.nextPage = null;
        }
        this.emit("change");
    },

    onLoadShout(payload) {
        client.get(payload.shoutId)
            .end(function (err, res) {
                if (err || res.status !== 200) {
                    this.flux.actions.requestFailed(err);
                } else {
                    this.flux.actions.loadShoutSuccess(res.body);
                }
            }.bind(this));
        this.state.loading = true;
        this.emit("change");
    },

    onLoadShoutSuccess(payload) {
        this.state.fullShouts[payload.res.id] = payload.res;
        this.state.loading = false;
        this.emit("change");
    },

    onLoadMore() {
        if (this.state.nextPage || this.state.shouts.length === 0) {
            client
                .list({
                    page: this.state.nextPage,
                    page_size: PAGE_SIZE
                })
                .end(function (err, res) {
                    if (err || res.status !== 200) {
                        this.flux.actions.requestFailed(err);
                    } else {
                        this.flux.actions.loadMoreSuccess(res.body);
                    }
                }.bind(this));

            this.state.loading = true;
            this.emit("change");
        }
    },

    findShout(shoutId) {
        var state = this.state,
            index = this.getIndex(shoutId);
        if (state.fullShouts[shoutId]) {
            return {
                full: true,
                shout: state.fullShouts[shoutId]
            };
        } else if (index >= 0) {
            return {
                full: false,
                shout: state.shouts[index]
            };
        } else {
            return {
                full: false,
                shout: undefined
            };
        }
    },

    getIndex(shoutId) {
        return findIndex(this.state.shouts, 'id', shoutId);
    },

    onLoadMoreSuccess(payload) {
        var state = this.state;
        payload.res.results.forEach(function (shout) {
            var index = this.getIndex(shout.id);
            if (index >= 0) {
                state.shouts[index] = shout;
            } else {
                state.shouts.push(shout);
            }
        }.bind(this));

        this.state.maxCount = Number(payload.res.count);
        if (payload.res.next) {
            this.state.nextPage = this.parseNextPage(payload.res.next);
        } else {
            this.state.nextPage = null;
        }

        state.loading = false;

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

export default ShoutStore;
