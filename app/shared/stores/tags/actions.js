/**
 * Created by Philip on 14.04.2015.
 */

var consts = require('./consts');

module.exports = {
	searchTags: function (term) {
		this.dispatch(consts.SEARCH_TAGS, {
			term: term
		});
	},

	cancelTagSearch: function () {
		this.dispatch(consts.SEARCH_TAGS_CANCEL);
	},

	searchTagsSuccess: function (term, res) {
		this.dispatch(consts.SEARCH_TAGS_SUCCESS, {
			res: res,
			term: term
		});
	},

	loadTag: function (tagName) {
		this.dispatch(consts.LOAD_TAG, {
			tagName: tagName
		});
	},

	loadTagSuccess: function (tagName, res) {
		this.dispatch(consts.LOAD_TAG_SUCCESS, {
			tagName: tagName,
			res: res
		});
	},

	listenTag: function (tagName) {
		this.dispatch(consts.LISTEN_TAG, {
			tagName: tagName
		});
	},

	listenTagSuccess: function (tagName) {
		this.dispatch(consts.LISTEN_TAG_SUCCESS, {
			tagName: tagName
		})
	},

	stopListenTag: function (tagName) {
		this.dispatch(consts.STOP_LISTEN_TAG, {
			tagName: tagName
		});
	},

	stopListenTagSuccess: function (tagName) {
		this.dispatch(consts.STOP_LISTEN_TAG_SUCCESS, {
			tagName: tagName
		});
	},

	loadTagListeners: function (tagName) {
		this.dispatch(consts.LOAD_TAG_LISTENERS, {
			tagName: tagName
		});
	},

	loadTagListenersSuccess: function (tagName, res) {
		this.dispatch(consts.LOAD_TAG_LISTENERS, {
			tagName: tagName,
			res: res
		});
	},

	loadTagShouts: function (tagName, type) {
		this.dispatch(consts.LOAD_TAG_SHOUTS, {
			tagName: tagName,
			type: type
		});
	}

};

