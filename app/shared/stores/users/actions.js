/**
 * Created by Philip on 23.02.2015.
 */

var consts = require('./consts');

module.exports = {
	login: function (type, token) {
		this.dispatch(consts.LOGIN, {
			type: type,
			token: token
		});
	},

	logout: function () {
		this.dispatch(consts.LOGOUT);
	},

	changeInfo: function (field, value) {
		this.dispatch(consts.INFO_CHANGE, {
			field: field,
			value: value
		});
	},

	saveInfo: function (field, value) {
		this.dispatch(consts.INFO_SAVE, {
			field: field,
			value: value
		});
	},

	listen: function (username) {
		this.dispatch(consts.LISTEN, {
			username: username
		});
	},

	stopListen: function (username) {
		this.dispatch(consts.STOP_LISTEN, {
			username: username
		});
	},

	loadUserListening: function (username) {
		this.dispatch(consts.LOAD_USER_LISTENING, {
			username: username
		});
	},

	loadUserListeners: function (username) {
		this.dispatch(consts.LOAD_USER_LISTENERS, {
			username: username
		});
	},

	loadUserShouts: function (username, type) {
		this.dispatch(consts.LOAD_USER_SHOUTS, {
			username: username,
			type: type
		});
	},

	loadUserShoutsSuccess: function (username, res) {
		this.dispatch(consts.LOAD_USER_SHOUTS_SUCCESS, {
			username: username,
			result: res
		});
	},

	loadUser: function (username) {
		this.dispatch(consts.LOAD_USER, {
			username: username
		})
	},

	loadUserSuccess: function (username, res) {
		this.dispatch(consts.LOAD_USER_SUCCESS, {
			username: username,
			res: res
		});
	}
};
