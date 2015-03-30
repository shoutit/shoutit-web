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
			user: props.user || null
		};

		this.router = props.router;

		this.bindActions(
			consts.LOGIN, this.onLogin,
			consts.LOGOUT, this.onLogout,
			consts.INFO_CHANGE, this.onInfoChange,
			consts.INFO_SAVE, this.onInfoSave
		);
	},

	onLogin: function (payload) {
		var endpoint,
			token = payload.token;

		var This = this;

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
					This.state.user = res.body;
					This.emit("change");
					This.router.transitionTo('app');
				}
			});
	},

	onLogout: function () {
		var This = this;
		request.get('/auth/logout')
			.accept('json')
			.end(function (err, res) {
				if (err) {
					console.error(err);
				} else if (res.status === 200 && res.body.loggedOut) {
					This.state.user = null;
					This.emit("change");
					This.router.transitionTo('app');
				}
			});
	},

	onInfoChange: function (payload) {
		if (this.state.user[payload.field]) {
			this.state.user[payload.field] = payload.value;
		}
		this.emit("change");
	},

	onInfoSave: function (payload) {
		var This = this;
		if (this.state.user[payload.field]) {
			var patch = {};

			patch[payload.field] = payload.value;

			client.update(patch).end(function (err, res) {
				if (err) {
					console.log(err);
				} else {
					This.state.user = res.body;
					This.emit("change");
				}
			});
		}
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