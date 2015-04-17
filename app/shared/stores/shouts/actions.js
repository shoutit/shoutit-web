/**
 * Created by Philip on 26.02.2015.
 */

var consts = require('./consts');

module.exports = {
	update: function () {
		this.dispatch(consts.UPDATE);
	},

	updateSuccess: function (res) {
		this.dispatch(consts.UPDATE_SUCCESS, {
			res: res
		});
	},

	requestFailed: function (err) {
		this.dispatch(consts.REQUEST_FAILED, {
			error: err
		});
	},

	loadMore: function () {
		this.dispatch(consts.LOAD_MORE);
	},

	loadMoreSuccess: function (res) {
		this.dispatch(consts.LOAD_MORE_SUCCESS, {
			res: res
		});
	},


	loadShout: function (shoutId) {
		this.dispatch(consts.LOAD_SHOUT, {
			shoutId: shoutId
		});
	},

	loadShoutSuccess: function (res) {
		this.dispatch(consts.LOAD_SHOUT_SUCCESS, {
			res: res
		});
	}
};
