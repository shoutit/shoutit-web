import consts from './consts';

export default {
	searchAll(term) {
		this.dispatch(consts.SEARCH_ALL, {
			term: term
		});
	},

	searchShouts(term) {
		this.dispatch(consts.SEARCH_SHOUTS, {
			term: term
		});
	},

	searchShoutsSuccess(term, res) {
		this.dispatch(consts.SEARCH_SHOUTS_SUCCESS, {
			term: term,
			res: res
		});
	},

	searchTags(term) {
		this.dispatch(consts.SEARCH_TAGS, {
			term: term
		});
	},

	searchTagsSuccess(term, res) {
		this.dispatch(consts.SEARCH_TAGS_SUCCESS, {
			term: term,
			res: res
		});
	},

	searchUsers(term) {
		this.dispatch(consts.SEARCH_USERS, {
			term: term
		});
	},

	searchUsersSuccess(term, res) {
		this.dispatch(consts.SEARCH_USERS_SUCCESS, {
			term: term,
			res: res
		});
	}
};
