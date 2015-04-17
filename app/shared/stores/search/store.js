"use strict";

/**
 * Created by Philip on 17.04.2015.
 */
var Fluxxor = require('fluxxor');

var SHOUT_TYPE = "shouts",
	TAG_TYPE = "tags",
	USER_TYPE = "users";

var consts = require('./consts');

var clients = {};
clients[SHOUT_TYPE] = require('../shouts/client');
clients[USER_TYPE] = require('../users/client');
clients[TAG_TYPE] = require('../tags/client');


var SearchStore = Fluxxor.createStore({
	initialize: function (props) {
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

	onSearchAll: function (payload) {
		this.searchShouts(payload);
		this.searchTags(payload);
		this.searchUsers(payload);
	},

	onSearch: function (type) {
		var cancelFn = this.onSearchCancel(type),
			successFn = this.onSearchSuccess(type);

		return function (payload) {
			var term = payload.term;

			// No Search for search Terms less than 3 characters.
			if (term.length < 3) return;

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

	onSearchCancel: function (type) {
		return function () {
			if (this.state.reqs[type] && this.state.reqs[type].abort) {
				this.state.reqs[type].abort();
				this.state.reqs[type] = null;
				this.state.searching[type] = false;
				this.emit("change");
			}
		}.bind(this);
	},

	onSearchSuccess: function (type) {
		return function (payload) {
			this.state[type][payload.term] = payload.res.results;
			this.emit("change");
		}.bind(this);
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

module.exports = SearchStore;
