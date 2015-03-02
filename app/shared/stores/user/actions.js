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
	}
};
