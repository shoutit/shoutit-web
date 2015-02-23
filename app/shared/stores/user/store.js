"use strict";

/**
 * Created by Philip on 17.02.2015.
 */
var Fluxxor = require('fluxxor'),
	request = require('superagent');

var consts = require('./consts');


var UserStore = Fluxxor.createStore({
	initialize: function (router) {
		this.user = {};
		this.router = router;

		this.bindActions(
			consts.LOGIN, this.onLogin,
			consts.LOGOUT, this.onLogout
		)
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
				} else if (res.status === 200 && res.body.success) {
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
					This.user = {};
				}
			});
	},

	serialize: function () {
		return JSON.stringify(this.state);
	},

	hydrate: function (json) {
		this.state = JSON.parse(json);
	},

	getState: function () {
		return {
			user: this.user,
			users: this.users
		}
	}
});

module.exports = UserStore;