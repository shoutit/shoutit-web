import Fluxxor from 'fluxxor';
import url from 'url';
import consts from './consts';
import client from './client';

import statuses from '../../consts/statuses.js';
var {LISTENING_CLICKED, BUTTON_LISTENED, BUTTON_UNLISTENED} = statuses;

var TagStore = Fluxxor.createStore({
	initialize(props) {
		this.state = {
			tags: {},
			featuredTags: null,
			loading: false,
			sprite: null,
			status: null
		};

		if (props.tag) {
			this.state.tags[props.tag.name] = {
				tag: null,
				offers: null,
				nextoffer: null,
				requests: null,
				nextrequest: null,
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
			consts.LOAD_MORE_TAG_SHOUTS, this.onLoadMoreTagShouts,
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

	parseNextPage(nextUrl) {
		if (nextUrl) {
			var parsed = url.parse(nextUrl, true);
			return Number(parsed.query.page);
		}
		return null;
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
				nextoffer: null,
				offers: null,
				requests: null,
				nextrequest: null,
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
		this.setFluxStatus(LISTENING_CLICKED);

		client.listen(tagName).end(function(res) {
			if(res.body.success) {
				this.onLoadTag(payload);
				// optimistically change button condition till the real data loads
				this.state.tags[tagName].tag.is_listening = true;
				this.setFluxStatus(BUTTON_LISTENED);
			}
		}.bind(this));
	},

	onStopListenTag(payload) {
		var tagName = payload.tagName;
		this.setFluxStatus(LISTENING_CLICKED);

		client.unlisten(tagName).end(function(res) {
			if(res.body.success) {
				this.onLoadTag(payload);
				// optimistically change button condition till the real data loads
				this.state.tags[tagName].tag.is_listening = false;
				this.setFluxStatus(BUTTON_UNLISTENED);
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
		let next = this.parseNextPage(payload.res.next);
		let tagShouts = this.state.tags[payload.tagName];

		this.addTagEntry(payload.tagName);
		tagShouts[payload.type + "s"] = payload.res.results;
		tagShouts["next" + payload.type] = next;
		this.state.loading = false;
		this.emit("change");
	},

	onLoadMoreTagShouts(payload) {
		let tagName = payload.tagName,
			type = payload.type,
			tagShouts = this.state.tags[tagName],
			next = tagShouts["next" + type];
			
		if(next !== null) {
			client.getShouts(tagName,{
				shout_type:type,
				page: next
			}).end(function(err,res){
				if (err) {
					console.log(err);
				} else {
					this.onLoadMoreTagShoutsSuccess({
						tagName: tagName,
						res: res.body,
						type: type
					});
				}
			}.bind(this));
			this.state.loading = true;
			this.emit("change");
		}
	},

	onLoadMoreTagShoutsSuccess(payload) {
		let tagName = payload.tagName,
			type = payload.type,
			tagShouts = this.state.tags[tagName],
			next = this.parseNextPage(payload.res.next),
			data = payload.res.results;

		data.forEach(function(val) {
			tagShouts[type + "s"].push(val);
		}.bind(this));
		tagShouts["next" + type] = next;
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

	setFluxStatus(status) {
		this.state.status = status;
		this.emit("change");
		//clearing status to avoid displaying old messages
		setTimeout(() => {
			this.state.status = null;
			this.emit("change");
		},0);
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
