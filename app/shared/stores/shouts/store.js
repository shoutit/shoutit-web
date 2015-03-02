"use strict";

/**
 * Created by Philip on 17.02.2015.
 */
var _ = require('lodash'),
	Fluxxor = require('fluxxor');

var consts = require('./consts'),
	client = require('./client'),
	actions = require('./actions');

var ShoutStore = Fluxxor.createStore({
	initialize: function (props) {
		this.state = {
			shouts: props.shouts && props.shouts.results ? props.shouts.results : [],
			page: 1
		};

		this.bindActions(
			consts.UPDATE, this.onUpdate,
			consts.UPDATE_SUCCESS, this.onUpdateSuccess,
			consts.LOAD_MORE, this.onLoadMore,
			consts.LOAD_MORE_SUCCESS, this.onLoadMoreSuccess,
			consts.REQUEST_FAILED, this.onReqFailed
		)
	},

	onReqFailed: function (err) {
		console.error(err);
	},

	onUpdate: function () {
		var flux = this.flux;

		client.fetch().end(function (err, res) {
			if (err || !res.body) {
				flux.actions.requestFailed(err);
			} else {
				flux.actions.updateSuccess(res.body);
			}
		});

	},

	onUpdateSuccess: function (payload) {
		this.state.shouts = payload.res.results;
		this.state.page = 1;
		this.emit("change");
	},

	onLoadMore: function () {
		var flux = this.flux;

		var nextPage = this.state.page + 1;
		client
			.fetch(nextPage)
			.end(function (err, res) {
				if (err) {
					flux.actions.requestFailed(err);
				} else {
					flux.actions.loadMoreSuccess(res, nextPage);
				}
			});
	},

	onLoadMoreSuccess: function (payload) {
		var state = this.state;
		state.page = payload.page;
		payload.res.shouts.forEach(function (shout, i) {
			var index = _.findIndex(state.shouts, 'id', shout.id);
			if (index >= 0) {
				state.shouts[index] = shout;
			} else {
				state.shouts.push(shout);
			}
		});
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
	}
});

module.exports = ShoutStore;
