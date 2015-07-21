import findIndex from 'lodash/array/findIndex';
import keys from 'lodash/object/keys';
import Fluxxor from 'fluxxor';
import url from 'url';

import consts from './consts';
import client from './client';

import defaults from '../../consts/defaults';

function shoutCollectionInit() {
	return {
		shouts: [],
		page: null,
		prev: null,
		next: null,
		maxCount: null
	};
}

function shoutDraftInit() {
	return {
		title: null,
		text: null,
		price: null,
		currency: null,
		tags: [],
		latLng: null,
		type: "offer",
		category: null
	};
}

function replyDraftInit(text) {
	return {
		text: text || ""
	};
}

let ShoutStore = Fluxxor.createStore({
	initialize(props) {
		this.state = {
			all: shoutCollectionInit(),
			offer: shoutCollectionInit(),
			request: shoutCollectionInit(),
			fullShouts: {},
			loading: false,
			currencies: {},
			categories: [],
			sortTypes: {},
			draft: shoutDraftInit(),
			replyDrafts: {}
		};

		if (props.currencies) {
			this.state.currencies = props.currencies;
		}

		if (props.categories) {
			this.state.categories = props.categories;
		}

		if (props.sortTypes) {
			this.state.sortTypes = props.sortTypes;
		}

		let shoutData = props.all || props.default;
		if (shoutData) {
			this.saveUpdate(shoutData, defaults.ALL_TYPE);
		}

		if (props.offers) {
			this.saveUpdate(props.offers, defaults.OFFER_TYPE);
		}

		if (props.requests) {
			this.saveUpdate(props.requests, defaults.REQUEST_TYPE);
		}

		if (props.shout) {
			this.state.fullShouts[props.shout.id] = this.augmentShout(props.shout);
		}


		this.bindActions(
			consts.UPDATE, this.onUpdate,
			consts.UPDATE_SUCCESS, this.onUpdateSuccess,
			consts.LOAD_MORE, this.onLoadMore,
			consts.LOAD_MORE_SUCCESS, this.onLoadMoreSuccess,
			consts.REQUEST_FAILED, this.onReqFailed,
			consts.LOAD_SHOUT, this.onLoadShout,
			consts.LOAD_SHOUT_SUCCESS, this.onLoadShoutSuccess,
			consts.LOAD_SHOUT_FAILED, this.onLoadShoutFailed,
			consts.CHANGE_SHOUT_DRAFT, this.onChangeShoutDraft,
			consts.SEND_SHOUT, this.onSendShout,
			consts.CHANGE_SHOUT_REPLY_DRAFT, this.onChangeShoutReplyDraft,
			consts.SEND_SHOUT_REPLY, this.onSendShoutReply,
			consts.SEND_SHOUT_REPLY_FAILED, this.onReqFailed
		);
	},

	augmentShouts(shouts) {
		return shouts.map(this.augmentShout.bind(this));
	},

	augmentShout(shout) {
		if (shout.currency && this.state.currencies[shout.currency]) {
			shout.origCurrency = shout.currency;
			shout.currency = this.state.currencies[shout.currency].name;
		}
		return shout;
	},

	saveUpdate(res, type = defaults.ALL_Type) {
		if (res.results) {
			let collection = this.state[type];
			collection.shouts = this.augmentShouts(res.results);
			collection.maxCount = Number(res.count);
			collection.next = this.parsePage(res.next);
			collection.prev = this.parsePage(res.previous);
			collection.page = collection.next - 1 || collection.prev + 1 || 1;
		}
	},

	parsePage(encUrl) {
		if (encUrl) {
			var parsed = url.parse(encUrl, true);
			return Number(parsed.query.page || 1);
		}
		return null;
	},

	onReqFailed(err) {
		console.error(err);
	},

	onUpdate(type = defaults.ALL_TYPE) {
		let locationsStore = this.flux.store("locations");
		client.list({
			page_size: defaults.PAGE_SIZE,
			city: locationsStore.getCurrentCity(),
			country: locationsStore.getCurrentCountry(),
			state: locationsStore.getCurrentState(),
			shout_type: type
		}).end(function (err, res) {
			if (err || !res.body) {
				this.flux.actions.requestFailed(err);
			} else {
				this.flux.actions.updateSuccess(res.body, type);
			}
		}.bind(this));
	},

	onLocUpdate() {
		if (this.state[defaults.ALL_TYPE].page) {
			this.onUpdate(defaults.ALL_TYPE);
		}
		if (this.state[defaults.OFFER_TYPE].page) {
			this.onUpdate(defaults.OFFER_TYPE);
		}
		if (this.state[defaults.REQUEST_TYPE].page) {
			this.onUpdate(defaults.REQUEST_TYPE);
		}
	},

	onUpdateSuccess({res, type}) {
		this.saveUpdate(res, type);
		this.emit("change");
	},

	onLoadShout({shoutId}) {
		client.get(shoutId)
			.end(function (err, res) {
				if (err || res.status !== 200) {
					this.flux.actions.loadShoutFailed(shoutId, res);
				} else {
					this.flux.actions.loadShoutSuccess(res.body);
				}
			}.bind(this));
		this.state.loading = true;
		this.emit("change");
	},

	onLoadShoutSuccess({res}) {
		this.state.fullShouts[res.id] = res;
		this.state.loading = false;
		this.emit("change");
	},

	onLoadShoutFailed({shoutId, res}) {
		if (res.status !== 404) {
			console.error(res.body);
		}
		this.state.fullShouts[shoutId] = null;
		this.state.loading = false;
		this.emit("change");
	},

	onLoadMore({type = defaults.ALL_TYPE}) {
		let locationsStore = this.flux.store("locations"),
			collection = this.state[type];

		if (collection.next || collection.shouts.length === 0) {
			client
				.list({
					page: collection.next,
					shout_type: type,
					page_size: defaults.PAGE_SIZE,
					city: locationsStore.getCurrentCity(),
					country: locationsStore.getCurrentCountry(),
					state: locationsStore.getCurrentState()
				})
				.end(function (err, res) {
					if (err || res.status !== 200) {
						this.flux.actions.requestFailed(err);
					} else {
						this.flux.actions.loadMoreSuccess(res.body, type);
					}
				}.bind(this));

			this.state.loading = true;
			this.emit("change");
		}
	},

	findShout(shoutId) {
		var state = this.state,
			index = this.getIndex(shoutId);
		if (state.fullShouts[shoutId]) {
			return {
				full: true,
				shout: state.fullShouts[shoutId]
			};
		} else if (index >= 0) {
			return {
				full: false,
				shout: state.shouts[index]
			};
		} else {
			return {
				full: false,
				shout: null
			};
		}
	},

	getIndex(collection, shoutId) {
		return findIndex(collection.shouts, 'id', shoutId);
	},

	onLoadMoreSuccess({res, type=defaults.ALL_TYPE}) {
		let collection = this.state[type];
		res.results.forEach(function (shout) {
			var index = this.getIndex(collection, shout.id);
			if (index >= 0) {
				collection.shouts[index] = this.augmentShout(shout);
			} else {
				collection.shouts.push(this.augmentShout(shout));
			}
		}.bind(this));

		collection.maxCount = Number(res.count);
		collection.next = this.parsePage(res.next);
		collection.page = collection.next - 1 || collection.prev + 1 || 1;
		this.state.loading = false;
		this.emit("change");
	},

	onChangeShoutDraft({key, value}) {
		this.state.draft[key] = value;
		console.log(this.state.draft);
		this.emit("change");
	},

	onSendShout() {
		this.validateDraft(this.state.draft)
			.then(this.transformDraft.bind(this))
			.then(this.sendShout)
			.then(function (result) {
				console.log(result);
			}, function (err) {
				console.error(err);
			});

	},

	sendShout(shoutDraft) {
		console.log(shoutDraft);

		return new Promise(function (resolve, reject) {
			client.create(shoutDraft)
				.end(function (err, res) {
					if (err || !res.body) {
						reject(err);
					} else {
						resolve(res.body);
					}
				});
		});
	},

	transformDraft(shoutDraft) {
		let locationStore = this.flux.store('locations');

		return new Promise(function (resolve, reject) {
			let shoutToSend = {};

			shoutToSend.title = shoutDraft.title;
			shoutToSend.text = shoutDraft.text;
			shoutToSend.type = shoutDraft.type;
			shoutToSend.price = shoutDraft.price;
			shoutToSend.currency = shoutDraft.currency.code;
			shoutToSend.location = {
				latitude: shoutDraft.latLng.lat(),
				longitude: shoutDraft.latLng.lng()
			};
			shoutToSend.tags = shoutDraft.tags.map(function (tag) {
				return {
					name: tag
				};
			});
			shoutToSend.category = {
				name: shoutDraft.category.name
			};

			console.log(shoutToSend);

			locationStore.geocode(shoutDraft.latLng, function (err, response) {
				if (err) {
					reject(err);
				} else {
					shoutToSend.location.google_geocode_response = response;
					resolve(shoutToSend);
				}
			});
		});
	},

	validateDraft(shoutDraft) {
		let errors = {};

		return new Promise(function (resolve, reject) {
			if (!shoutDraft.title || shoutDraft.title.length < 10) {
				errors.title = "Please enter a title with 10 to 200 chars";
			}
			if (!shoutDraft.text || shoutDraft.text.length < 10 || shoutDraft.text.length > 1000) {
				errors.text = "Please enter a description with 10 to 1000 chars";
			}
			if (!shoutDraft.price) {
				errors.price = "Please enter a price";
			}
			if (!shoutDraft.currency) {
				errors.currency = "Please select a currency";
			}
			if (!shoutDraft.latLng) {
				errors.locaiton = "Please select a location";
			}

			if (keys(errors).length) {
				reject(errors);
			} else {
				resolve(shoutDraft);
			}
		});
	},

	onChangeShoutReplyDraft({shoutId, text}) {
		let draft = this.state.replyDrafts[shoutId];

		if (draft) {
			draft.text = text;
		} else {
			this.state.replyDrafts[shoutId] = replyDraftInit(text);
		}

		this.emit("change");
	},

	onSendShoutReply({shoutId}) {
		this.state.replyDrafts[shoutId] = replyDraftInit();
		this.emit("change");
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

export default ShoutStore;
