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

	loadTagSuccess: function (res) {
		this.dispatch(consts.LOAD_SHOUT_SUCCESS, {
			res: res
		});
	},

	searchShouts: function(term) {
		this.dispatch(consts.SEARCH_SHOUTS, {
			term: term
		});
	},

	cancelShoutSearch: function() {
		this.dispatch(consts.SEARCH_SHOUTS_CANCEL);
	},

	searchShoutsSuccess: function(term,res) {
		this.dispatch(consts.SEARCH_SHOUTS_SUCCESS, {
			res:res,
			term: term
		});
	}
};
