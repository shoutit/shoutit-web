/**
 * Created by Philip on 23.02.2015.
 */

var consts = require('./consts');

module.exports = {
	login: function(type, token) {
		this.dispatch(consts.LOGIN, {
			type: type,
			token: token
		});
	},

	logout: function() {
		this.dispatch(consts.LOGOUT);
	},

	changeInfo: function(field, value) {
		this.dispatch(consts.INFO_CHANGE, {
			field: field,
			value: value
		});
	},

	saveInfo: function(field, value) {
		this.dispatch(consts.INFO_SAVE, {
			field: field,
			value: value
		});
	},

	listen: function(username) {
		this.dispatch(consts.LISTEN, {
			username: username
		});
	},

	stopListen: function(username) {
		this.dispatch(consts.STOP_LISTEN, {
			username: username
		});
	},

	fetchListening: function() {
		this.dispatch(consts.FETCH_LISTENING);
	},

	fetchListeners: function() {
		this.dispatch(consts.FETCH_LISTENERS);
	}
};
