"use strict";

/**
 * Created by Philip on 17.02.2015.
 */
var Fluxxor = require('fluxxor'),
	request = require('superagent');

var consts = require('./consts'),
	client = require('./client');

var UserStore = Fluxxor.createStore({
	initialize: function (props) {
		this.state = {
			user: props.user || null,
			listeners: props.profileListeners || [],
			listening: props.profileListening || [],
			shouts: props.profileOffers || props.profileRequests || [],
			loading: false
		};

		this.router = props.router;

		this.bindActions(
			consts.LOGIN, this.onLogin,
			consts.LOGOUT, this.onLogout,
			consts.INFO_CHANGE, this.onInfoChange,
			consts.INFO_SAVE, this.onInfoSave,
			consts.LISTEN, this.onListen,
			consts.STOP_LISTEN, this.onStopListen,
			consts.FETCH_LISTENERS, this.onFetchListeners,
			consts.FETCH_LISTENING, this.onFetchListening,
			consts.LOAD_USER_SHOUTS, this.onLoadUserShouts,
			consts.LOAD_USER_SHOUTS_SUCCESS, this.onLoadUserShoutsSuccess
		);
	},

	onLogin: function (payload) {
		var endpoint,
			token = payload.token;


		if (payload.type === 'gplus') {
			endpoint = '/auth/gplus';
		} else if (payload.type === 'fb') {
			endpoint = '/auth/fb';
		}

		request
			.post(endpoint)
			.type('json')
			.accept('json')
			.send({token: token})
			.end(function (err, res) {
				if (err) {
					console.error(err);
				} else {
					this.state.user = res.body;
					this.emit("change");
					this.router.transitionTo('app');
				}
			}.bind(this));
	},

	onLogout: function () {
		request.get('/auth/logout')
			.accept('json')
			.end(function (err, res) {
				if (err) {
					console.error(err);
				} else if (res.status === 200 && res.body.loggedOut) {
					this.state.user = null;
					this.emit("change");
					this.router.transitionTo('app');
				}
			}.bind(this));
	},

	onInfoChange: function (payload) {
		if (this.state.user[payload.field]) {
			this.state.user[payload.field] = payload.value;
		}
		this.emit("change");
	},

	onInfoSave: function (payload) {
		if (this.state.user[payload.field]) {
			var patch = {};

			patch[payload.field] = payload.value;

			client.update(patch).end(function (err, res) {
				if (err) {
					console.log(err);
				} else {
					this.state.user = res.body;
					this.state.loading = false;
					this.emit("change");
				}
			}.bind(this));
		}
		this.state.loading = true;
		this.emit("change");
	},

	onListen: function (payload) {
		client.listen(payload.username).end(function (err, res) {
			if (err) {
				console.log(err);
			} else {
				// Refresh Listening List
				this.onFetchListening();
			}
		}.bind(this))
	},

	onStopListen: function (payload) {
		client.stopListen(payload.username)
			.end(function (err, res) {
				if (err) {
					console.log(err);
				} else {
					// TODO Use Lodash here
					delete this.state.listening[payload.username];
					this.emit("change");
				}
			}.bind(this));
	},

	onFetchListeners: function () {
		client.getListeners().end(function (err, res) {
			if (err) {
				console.log(err);
			} else {
				this.state.listeners = res.body.results;
			}
			this.state.loading = false;
			this.emit("change");
		}.bind(this));

		this.state.loading = true;
		this.emit("change");
	},

	onFetchListening: function () {
		client.getListening().end(function (err, res) {
			if (err) {
				console.log(err);
			} else {
				this.state.listening = res.body.users;
			}
			this.state.loading = false;
			this.emit("change");
		}.bind(this));

		this.state.loading = true;
		this.emit("change");
	},

	onLoadUserShouts: function () {
		client.loadShouts().end(function (err, res) {
			if (err) {
				console.log(err);
			} else {
				this.flux.actions.loadUserShoutsSuccess(res.body);
			}
		}.bind(this));

		this.state.loading = true;
		this.emit("change");
	},

	onLoadUserShoutsSuccess: function (payload) {
		this.state.shouts = payload.result.results;
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
	}
});

module.exports = UserStore;