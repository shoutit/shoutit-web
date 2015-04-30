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
			user: null,
			users: {},
			listeners: {},
			listening: {},
			shouts: {},
			loading: false
		};

		if(props.loggedUser) {
			var loggedUsername = props.loggedUser.username;

			this.state.users[loggedUsername] = props.loggedUser;
			this.state.user = loggedUsername;
		}

		if (props.user) {
			var username = props.user.username;

			this.state.users[username] = props.user;

			this.state.shouts[username] = {
				offers: null,
				requests: null
			};
			this.state.listeners[username] = null;
			this.state.listening[username] = {
				users: null,
				tags: null
			};

			if (props.useroffers) {
				this.state.shouts[username]["offers"] = props.useroffers.results;
			}

			if (props.userrequests) {
				this.state.shouts[username]["requests"] = props.userrequests.results;
			}

			if (props.listeners) {
				this.state.listeners[username] = props.listeners.results;
			}

			if (props.listening) {
				this.state.listening[username].users = props.listening.users;
				this.state.listening[username].tags = props.listening.tags;
			}
		}

		this.router = props.router;

		this.bindActions(
			consts.LOGIN, this.onLogin,
			consts.LOGOUT, this.onLogout,
			consts.INFO_CHANGE, this.onInfoChange,
			consts.INFO_SAVE, this.onInfoSave,
			consts.LISTEN, this.onListen,
			consts.STOP_LISTEN, this.onStopListen,
			consts.LOAD_USER_LISTENERS, this.onLoadUserListeners,
			consts.LOAD_USER_LISTENING, this.onLoadUserListening,
			consts.LOAD_USER, this.onLoadUser,
			consts.LOAD_USER_SUCCESS, this.onLoadUserSuccess,
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
					var loggedUser = res.body;
					this.state.users[loggedUser.username] = loggedUser;
					this.state.user = loggedUser.username;
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
		if (this.state.users[this.state.user][payload.field]) {
			var patch = {};

			patch[payload.field] = payload.value;

			client.update(patch).end(function (err, res) {
				if (err) {
					console.log(err);
				} else {
					var loggedUser = res.body;
					this.state.users[loggedUser.username] = loggedUser;
					this.state.user = loggedUser.username;
					this.state.loading = false;
					this.emit("change");
				}
			}.bind(this));
		}
		this.state.loading = true;
		this.emit("change");
	},

	onListen: function (payload) {
		var username = payload.username;

		client.listen(username).end(function (err, res) {
			if (err) {
				console.log(err);
			} else {
				// Refresh Listening List
				this.onLoadUserListening({
					username: this.state.user
				});
			}
		}.bind(this))
	},

	onStopListen: function (payload) {
		var username = payload.username;

		client.stopListen(username)
			.end(function (err, res) {
				if (err) {
					console.log(err);
				} else {
					// Refresh Listening List
					this.onLoadUserListening({
						username: this.state.user
					});
				}
			}.bind(this));
	},

	onLoadUserListeners: function (payload) {
		var username = payload.username;

		client.getListeners(username).end(function (err, res) {
			if (err) {
				console.log(err);
			} else {
				this.state.listeners[username] = res.body.results;
			}
			this.state.loading = false;
			this.emit("change");
		}.bind(this));

		this.state.loading = true;
		this.emit("change");
	},

	onLoadUserListening: function (payload) {
		var username = payload.username;

		client.getListening(username).end(function (err, res) {
			if (err) {
				console.log(err);
			} else {
				this.state.listening[username].users = res.body.users;
				this.state.listening[username].tags = res.body.tags;
			}
			this.state.loading = false;
			this.emit("change");
		}.bind(this));

		this.state.loading = true;
		this.emit("change");
	},

	onLoadUserShouts: function (payload) {
		var username = payload.username,
			type = payload.type;

		client.loadShouts(username, type).end(function (err, res) {
			if (err) {
				console.log(err);
			} else {
				this.onLoadUserShoutsSuccess({
					username: username,
					result: res.body,
					type: type
				});
			}
		}.bind(this));
		this.state.loading = true;
		this.emit("change");
	},

	onLoadUserShoutsSuccess: function (payload) {
		if(!this.state.shouts[payload.username]) {
			this.state.shouts[payload.username] = {
				offers: null,
				requests: null
			};
		}
		this.state.shouts[payload.username][payload.type + "s"] = payload.result.results;
		this.state.loading = false;
		this.emit("change");
	},

	onLoadUser: function (payload) {
		var username = payload.username;

		client.get(username)
			.end(function (err, res) {
				if (err || res.status !== 200) {
					this.onLoadUserFailed({
						username: username
					});
				} else {
					this.onLoadUserSuccess({
						username: username,
						res: res.body
					});
				}
			}.bind(this));

		this.state.loading = true;
		this.emit("change");
	},

	onLoadUserSuccess: function (payload) {
		this.state.users[payload.username] = payload.res;
		this.state.shouts[payload.username] = {
			offers: null,
			requests: null
		};
		this.state.listening[payload.username] = {
			users: null,
			tags: null
		};
		this.state.loading = false;
		this.emit("change");
	},

	onLoadUserFailed: function(payload) {
		this.state.users[payload.username] = null;
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