"use strict";

/**
 * Created by Philip on 17.02.2015.
 */
var _ = require('lodash'),
	url = require('url'),
	Fluxxor = require('fluxxor');

var consts = require('./consts'),
	client = require('./client');

var ShoutStore = Fluxxor.createStore({
	initialize: function (props) {
		this.state = {
			shouts: props.shouts && props.shouts.results ? props.shouts.results : [],
			page: props.shouts && props.shouts.results ? 1 : 0,
			next: props.shouts && props.shouts.next ? this.parseNextUrl(props.shouts.next) : null
		};

		this.bindActions(
			consts.UPDATE, this.onUpdate,
			consts.UPDATE_SUCCESS, this.onUpdateSuccess,
			consts.LOAD_MORE, this.onLoadMore,
			consts.LOAD_MORE_SUCCESS, this.onLoadMoreSuccess,
			consts.REQUEST_FAILED, this.onReqFailed
		)
	},

	parseNextUrl: function (nextUrl) {
		if (nextUrl) {
			var parsed = url.parse(nextUrl, true);
			return parsed.query.page;
		} else {
			return null;
		}
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
		this.state.next = this.parseNextUrl(payload.res.next);
		this.emit("change");
	},

	onLoadMore: function () {
		var flux = this.flux;

		if (this.state.next) {
			var nextPage = this.state.next;
			client
				.fetch(nextPage)
				.end(function (err, res) {
					if (err || res.status !== 200) {
						flux.actions.requestFailed(err);
					} else {
						flux.actions.loadMoreSuccess(res.body, nextPage);
					}
				});
		}
	},

	onLoadMoreSuccess: function (payload) {
		var state = this.state;
		state.page = payload.page;
		payload.res.results.forEach(function (shout) {
			var index = _.findIndex(state.shouts, 'id', shout.id);
			if (index >= 0) {
				state.shouts[index] = shout;
			} else {
				state.shouts.push(shout);
			}
		});
		state.next = this.parseNextUrl(payload.res.next);
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
