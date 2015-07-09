import consts from './consts';
import client from './client';

export default {
	loadTag(tagName) {
		this.dispatch(consts.LOAD_TAG, {
			tagName: tagName
		});
	},

	loadTagSuccess(tagName, res) {
		this.dispatch(consts.LOAD_TAG_SUCCESS, {
			tagName: tagName,
			res: res
		});
	},

	listenTag(tagName) {
		this.dispatch(consts.LISTEN_TAG, {
			tagName: tagName
		});
	},

	listenTagSuccess(tagName) {
		this.dispatch(consts.LISTEN_TAG_SUCCESS, {
			tagName: tagName
		});
	},

	stopListenTag(tagName) {
		this.dispatch(consts.STOP_LISTEN_TAG, {
			tagName: tagName
		});
	},

	stopListenTagSuccess(tagName) {
		this.dispatch(consts.STOP_LISTEN_TAG_SUCCESS, {
			tagName: tagName
		});
	},

	loadTagListeners(tagName) {
		this.dispatch(consts.LOAD_TAG_LISTENERS, {
			tagName: tagName
		});
	},

	loadTagListenersSuccess(tagName, res) {
		this.dispatch(consts.LOAD_TAG_LISTENERS, {
			tagName: tagName,
			res: res
		});
	},

	loadTagShouts(tagName, type) {
		this.dispatch(consts.LOAD_TAG_SHOUTS, {
			tagName: tagName,
			type: type
		});
	},

	loadTags(query) {
		this.dispatch(consts.LOAD_TAGS, {query});

		client.list(query)
			.end(function (error, res) {
				if (error || !res.ok) {
					this.dispatch(consts.LOAD_TAGS_FAILED, {
						error
					});
				} else {
					this.dispatch(consts.LOAD_TAGS_SUCCESS, {
						res: res.body
					});
				}
			}.bind(this));
	}

};

