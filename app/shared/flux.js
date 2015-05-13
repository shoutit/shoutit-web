"use strict";

/**
 * Created by Philip on 17.02.2015.
 */

var merge = require('lodash/object/merge'),
	Fluxxor = require("fluxxor"),
	UsersStore = require('./stores/users/store'),
	ShoutStore = require('./stores/shouts/store'),
	TagStore = require('./stores/tags/store'),
	SearchStore = require('./stores/search/store'),
	LocationsStore = require('./stores/locations/store'),
	userActions = require('./stores/users/actions'),
	shoutActions = require('./stores/shouts/actions'),
	tagActions = require('./stores/tags/actions'),
	searchActions = require('./stores/search/actions'),
	locationsActions = require('./stores/locations/actions');

module.exports = function (router, user, data, params) {
	var stores = {
		users: new UsersStore(merge({}, {
			loggedUser: user,
			router: router
		}, data)),
		shouts: new ShoutStore(data, params),
		tags: new TagStore(data, params),
		search: new SearchStore(merge({}, data, params)),
		locations: new LocationsStore(merge({}, data, {router, params}))
	};

	var actions = merge({}, userActions, shoutActions, tagActions, searchActions, locationsActions);

	var flux = new Fluxxor.Flux(stores, actions);

	flux.serialize = function () {
		var storeData = {};

		for (var store in stores) {
			if (stores.hasOwnProperty(store)) {
				storeData[store] = stores[store].serialize();
			}
		}

		return JSON.stringify(storeData);
	};

	flux.hydrate = function (storeData) {
		for (var store in storeData) {
			if (storeData.hasOwnProperty(store)) {
				stores[store].hydrate(storeData[store]);
			}
		}
	};

	return flux;
};
