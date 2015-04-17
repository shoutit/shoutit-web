/**
 * Created by Philip on 26.02.2015.
 */

var consts = require('./consts');

module.exports = {
	searchAll: function(term) {
		this.dispatch(consts.SEARCH_ALL, {
			term: term
		});
	},

	searchShouts: function(term) {
		this.dispatch(consts.SEARCH_SHOUTS, {
			term: term
		});
	},

	searchShoutsSuccess: function(term, res) {
		this.dispatch(consts.SEARCH_SHOUTS_SUCCESS, {
			term: term,
			res: res
		});
	},

	searchTags: function(term) {
		this.dispatch(consts.SEARCH_TAGS, {
			term: term
		});
	},

	searchTagsSuccess: function(term, res) {
		this.dispatch(consts.SEARCH_TAGS_SUCCESS, {
			term: term,
			res: res
		});
	},

	searchUsers: function(term) {
		this.dispatch(consts.SEARCH_USERS, {
			term: term
		});
	},

	searchUsersSuccess: function(term, res) {
		this.dispatch(consts.SEARCH_USERS_SUCCESS, {
			term: term,
			res: res
		});
	}
};
