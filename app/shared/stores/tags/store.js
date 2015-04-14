"use strict";

/**
 * Created by Philip on 14.04.2015.
 */
var url = require('url'),
	Fluxxor = require('fluxxor');

var consts = require('./consts'),
	client = require('./client');

var TagStore = Fluxxor.createStore({
	initialize: function (props) {
		this.state = {
			tags: {},
			loading: false,
			searching: false,
			searchReq: null,
			searchResults: {}
		};

		if (props.tag) {
			this.state.tags[props.tag.name] = {
				tag: null,
				offers: null,
				requests: null,
				listeners: null
			};

			this.state.tags[props.tag.name].tag = props.tag;

			if (props.tagoffers) {
				this.state.tags[props.tag.name].offers = props.tagoffers.results;
			}

			if (props.tagrequests) {
				this.state.tags[props.tag.name].requests = props.tagrequests.results;
			}

			if (props.taglisteners) {
				this.state.tags[props.tag.name].listeners = props.taglisteners.results;
			}
		}


		this.bindActions(
			consts.SEARCH_TAGS, this.onSearchTags,
			consts.SEARCH_TAGS_CANCEL, this.onSearchTagsCancel,
			consts.SEARCH_TAGS_SUCCESS, this.onSearchTagsSuccess,
			consts.LOAD_TAG, this.onLoadTag,
			consts.LOAD_TAG_SUCCESS, this.onSearchTagsSuccess,
			consts.LISTEN_TAG, this.onListenTag,
			consts.STOP_LISTEN_TAG, this.onStopListenTag,
			consts.LOAD_TAG_SHOUTS, this.onLoadTagShouts,
			consts.LOAD_TAG_SHOUTS_SUCCESS, this.onLoadTagShoutsSuccess,
			consts.LOAD_TAG_LISTENERS, this.onLoadTagListeners,
			consts.LOAD_TAG_LISTENERS_SUCCESS, this.onLoadTagListenersSuccess
		);
	},

	onLoadTag: function (payload) {
		var tagName = payload.tagName;
		client.get(tagName)
			.end(function (err, res) {
				if (err || res.status !== 200) {
					console.log(err)
				} else {
					this.onLoadTagSuccess({
						res: res.body,
						tagName: tagName
					});
				}
			}.bind(this));
		this.state.loading = true;
		this.emit("change");
	},

	addTagEntry: function(tagName) {
		if(!this.state.tags[tagName]) {
			this.state.tags[tagName] = {
				tag: null,
				offers: null,
				requests: null,
				listeners: null
			};
		}
	},

	onLoadTagSuccess: function (payload) {
		this.addTagEntry(payload.tagName);
		this.state.tags[payload.tagName].tag = payload.res;
		this.state.loading = false;
		this.emit("change");
	},

	onSearchTags: function (payload) {
		var term = payload.term;

		// No Search for search Terms less than 3 characters.
		if (term.length < 3) return;

		this.onSearchTagsCancel();

		var searchReq = client.list({
			search: term
		});

		searchReq.end(function (err, res) {
			this.state.searchReq = null;
			this.state.searching = false;
			this.emit("change");
			if (err) {
				console.log(err);
			} else {
				this.flux.actions.onSearchTagsSuccess(term, res.body);
			}
		}.bind(this));

		this.state.searchReq = searchReq;
		this.state.searching = true;
		this.emit("change");
	},

	onSearchTagsSuccess: function (payload) {
		this.state.searchResults[payload.term] = payload.res.results;
		this.emit("change");
	},

	onSearchTagsCancel: function () {
		if (this.state.searchReq && this.state.searchReq.abort) {
			this.state.searchReq.abort();
			this.state.searchReq = null;
			this.state.searching = false;
			this.emit("change");
			console.log("Canceled Search.");
		}
	},

	onListenTag: function (payload) {
		var tagName = payload.tagName;

		client.listen(tagName).end(function (err, res) {
			if (err) {
				console.log(err)
			} else {
				this.onLoadTag({
					tagName: tagName
				});
			}
		}.bind(this));

	},

	onStopListenTag: function (payload) {
		var tagName = payload.tagName;

		client.unlisten(tagName).end(function (err, res) {
			if (err) {
				console.log(err)
			} else {
				this.onLoadTag({
					tagName: tagName
				});
			}
		}.bind(this));

	},

	onLoadTagShouts: function (payload) {
		var tagName = payload.tagName,
			type = payload.type;

		client.getShouts(tagName, {
			shout_type: type
		}).end(function (err, res) {
			if (err) {
				console.log(err);
			} else {
				this.onLoadTagShoutsSuccess({
					tagName: tagName,
					res: res.body,
					type: type
				});
			}
		}.bind(this));
		this.state.loading = true;
		this.emit("change");
	},

	onLoadTagShoutsSuccess: function (payload) {
		this.addTagEntry(payload.tagName);
		this.state.tags[payload.tagName][payload.type + "s"] = payload.res.results;
		this.state.loading = false;
		this.emit("change");
	},

	onLoadTagListeners: function (payload) {
		var tagName = payload.tagName;

		client.getListeners(tagName).end(function (err, res) {
			if (err) {
				console.log(err);
			} else {
				this.onLoadTagListenersSuccess({
					tagName: tagName,
					res: res.body
				});
			}
		}.bind(this));
		this.state.loading = true;
		this.emit("change");
	},

	onLoadTagListenersSuccess: function (payload) {
		this.addTagEntry(payload.tagName);
		this.state.tags[payload.tagName].listeners = payload.res.results;
		this.state.loading = false;
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

	getSearchState: function () {
		return {
			searchResults: this.state.searchResults,
			searching: this.state.searching
		}
	}
});

module.exports = TagStore;
