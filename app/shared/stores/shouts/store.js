"use strict";

/**
 * Created by Philip on 17.02.2015.
 */
var findIndex = require('lodash/array/findIndex'),
	Fluxxor = require('fluxxor');

var consts = require('./consts'),
	client = require('./client');

var ShoutStore = Fluxxor.createStore({
	initialize: function (props) {
		this.state = {
			shouts: [],
			fullShouts: {},
			loading: false
		};

		if (props.home) {
			this.state.shouts = props.home.results;
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

	onReqFailed: function (err) {
		console.error(err);
	},

	onUpdate: function () {
		client.list().end(function (err, res) {
			if (err || !res.body) {
				this.flux.actions.requestFailed(err);
			} else {
				this.flux.actions.updateSuccess(res.body);
			}
		}.bind(this));
	},

	onUpdateSuccess: function (payload) {
		this.state.shouts = payload.res.results;
		this.emit("change");
	},

	onLoadShout: function (payload) {
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

	onLoadShoutSuccess: function (payload) {
		this.state.fullShouts[payload.res.id] = payload.res;
		this.state.loading = false;
		this.emit("change");
	},

	onLoadMore: function () {
		var lastShout = this.state.shouts[this.state.shouts.length - 1];
		client
			.list({
				before: lastShout ? lastShout.date_published : Math.floor(Date.now() / 1000)
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
	},

	findShout: function (shoutId) {
		var state = this.state,
			index = this._getIndex(shoutId);
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

	_getIndex: function (shoutId) {
		return findIndex(this.state.shouts, 'id', shoutId);
	},

	onLoadMoreSuccess: function (payload) {
		var state = this.state;
		var This = this;
		payload.res.results.forEach(function (shout) {
			var index = This._getIndex(shout.id);
			if (index >= 0) {
				state.shouts[index] = shout;
			} else {
				state.shouts.push(shout);
			}
		});

		state.shouts.sort(function (a, b) {
			return b.date_published - a.date_published;
		});

		state.loading = false;

		this.emit("change");
	},

	serialize: function () {
		return JSON.stringify(this.state);
	},

	hydrate: function (json) {
		this.state = JSON.parse(json);
	},

	getState: function () {
		return this.state;
	},

	getUsersOffers: function (username) {
		return {
			shouts: this.state.shouts.filter(function (shout) {
				return shout.type === "offer" && shout.user.username === username;
			})
		};
	},

	getUsersRequests: function (username) {
		return {
			shouts: this.state.shouts.filter(function (shout) {
				return shout.type === "request" && shout.user.username === username;
			})
		};
	}
});

module.exports = ShoutStore;
