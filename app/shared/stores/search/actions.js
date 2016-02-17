import consts from "./consts";

export default {
  searchAll(payload) {
    this.dispatch(consts.SEARCH_TAGS, payload);
    this.dispatch(consts.SEARCH_USERS, payload);
    this.dispatch(consts.SEARCH_SHOUTS, payload);
  },

  searchShouts(payload) {
    this.dispatch(consts.SEARCH_SHOUTS, payload);
  },

  searchShoutsSuccess(term, res) {
    this.dispatch(consts.SEARCH_SHOUTS_SUCCESS, {
      term: term,
      res: res
    });
  },

  searchTags(payload) {
    this.dispatch(consts.SEARCH_TAGS, payload);
  },

  searchTagsSuccess(term, res) {
    this.dispatch(consts.SEARCH_TAGS_SUCCESS, {
      term: term,
      res: res
    });
  },

  searchUsers(payload) {
    this.dispatch(consts.SEARCH_USERS, payload);
  },

  searchUsersSuccess(term, res) {
    this.dispatch(consts.SEARCH_USERS_SUCCESS, {
      term: term,
      res: res
    });
  },

  searchLoadMore() {
    this.dispatch(consts.SEARCH_LOAD_MORE);
  }
};
