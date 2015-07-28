import Fluxxor from 'fluxxor';

import consts from './consts';
import client from './client';

var TagStore = Fluxxor.createStore({
	initialize(props) {
		this.state = {
			tags: {},
			featuredTags: null,
			loading: false,
			sprite: null
		};

		if (props.tag) {
			this.state.tags[props.tag.name] = {
				tag: null,
				offers: null,
				requests: null,
				listeners: null
			};

			this.state.tags[props.tag.name].tag = props.tag;

			if (props.tagoffers) {
				this.state.tags[props.tag.name].offers = props.tagoffers.results;
			}

			if (props.tagrequests) {
				this.state.tags[props.tag.name].requests = props.tagrequests.results;
			}

			if (props.taglisteners) {
				this.state.tags[props.tag.name].listeners = props.taglisteners.results;
			}
		}

		let tagsData = props.tags || props.feed;
		if (tagsData) {
			this.state.featuredTags = tagsData.results;
		}


		this.bindActions(
			consts.LOAD_TAG, this.onLoadTag,
			consts.LOAD_TAG_SUCCESS, this.onLoadTagSuccess,
			consts.LISTEN_TAG, this.onListenTag,
			consts.STOP_LISTEN_TAG, this.onStopListenTag,
			consts.LOAD_TAG_SHOUTS, this.onLoadTagShouts,
			consts.LOAD_TAG_SHOUTS_SUCCESS, this.onLoadTagShoutsSuccess,
			consts.LOAD_TAG_LISTENERS, this.onLoadTagListeners,
			consts.LOAD_TAG_LISTENERS_SUCCESS, this.onLoadTagListenersSuccess,
			consts.LOAD_TAGS_SUCCESS, this.onLoadTagsSuccess,
			consts.LOAD_TAGS_SPRITE, this.onLoadTagsSprite,
			consts.LOAD_TAGS_SPRITE_SUCCESS, this.onLoadTagsSpriteSuccess,
			consts.LOAD_TAGS_SPRITE_FAILED, this.onLoadTagsSpriteFailed,
			consts.REQUEST_SPRITING, this.onRequestSpriting,
			consts.REQUEST_SPRITING_SUCCESS, this.onLoadTagsSpriteSuccess,
			consts.REQUEST_SPRITING_FAILED, this.onRequestSpritingFailed
		);
	},

	onLoadTag(payload) {
		var tagName = payload.tagName;
		client.get(tagName)
			.end(function (err, res) {
				if (err || res.status !== 200) {
					this.onLoadTagFailed({
						res: res.body,
						tagName: tagName
					});
				} else {
					this.onLoadTagSuccess({
						res: res.body,
						tagName: tagName
					});
				}
			}.bind(this));
		this.state.loading = true;
		this.emit("change");
	},

	addTagEntry(tagName) {
		if (!this.state.tags[tagName]) {
			this.state.tags[tagName] = {
				tag: null,
				offers: null,
				requests: null,
				listeners: null
			};
		}
	},

	onLoadTagSuccess(payload) {
		this.addTagEntry(payload.tagName);
		this.state.tags[payload.tagName].tag = payload.res;
		this.state.loading = false;
		this.emit("change");
	},

	onLoadTagFailed(payload) {
		this.state.tags[payload.tagName] = null;
		this.state.loading = false;
		this.emit("change");
	},

	onListenTag(payload) {
		var tagName = payload.tagName;

		client.listen(tagName).end(function (err) {
			if (err) {
				console.log(err);
			} else {
				this.onLoadTag({
					tagName: tagName
				});
			}
		}.bind(this));

	},

	onStopListenTag(payload) {
		var tagName = payload.tagName;

		client.unlisten(tagName).end(function (err) {
			if (err) {
				console.log(err);
			} else {
				this.onLoadTag({
					tagName: tagName
				});
			}
		}.bind(this));

	},

	onLoadTagShouts(payload) {
		var tagName = payload.tagName,
			type = payload.type;

		client.getShouts(tagName, {
			shout_type: type
		}).end(function (err, res) {
			if (err) {
				console.log(err);
			} else {
				this.onLoadTagShoutsSuccess({
					tagName: tagName,
					res: res.body,
					type: type
				});
			}
		}.bind(this));
		this.state.loading = true;
		this.emit("change");
	},

	onLoadTagShoutsSuccess(payload) {
		this.addTagEntry(payload.tagName);
		this.state.tags[payload.tagName][payload.type + "s"] = payload.res.results;
		this.state.loading = false;
		this.emit("change");
	},

	onLoadTagListeners(payload) {
		var tagName = payload.tagName;

		client.getListeners(tagName).end(function (err, res) {
			if (err) {
				console.log(err);
			} else {
				this.onLoadTagListenersSuccess({
					tagName: tagName,
					res: res.body
				});
			}
		}.bind(this));
		this.state.loading = true;
		this.emit("change");
	},

	onLoadTagListenersSuccess(payload) {
		this.addTagEntry(payload.tagName);
		this.state.tags[payload.tagName].listeners = payload.res.results;
		this.state.loading = false;
		this.emit("change");
	},

	onLoadTagsSuccess({res}) {
		this.state.featuredTags = res.results;
		this.emit("change");
	},

	onLoadTagsSprite({hash}) {
	},

	onLoadTagsSpriteSuccess({res}) {
		this.state.sprite = res;
		this.emit("change");
	},

	onLoadTagsSpriteFailed({hash}) {
		this.state.sprite = undefined;
		this.emit("change");
	},

	onRequestSpriting() {
	},

	onRequestSpritingFailed() {
	},

	serialize() {
		return JSON.stringify(this.state);
	},

	hydrate(json) {
		this.state = JSON.parse(json);
	},

	getState() {
		return this.state;
	}
});

export default TagStore;
