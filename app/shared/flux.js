"use strict";

/**
 * Created by Philip on 17.02.2015.
 */

var merge = require('lodash/object/merge'),
	Fluxxor = require("fluxxor"),
	UserStore = require('./stores/user/store'),
	ShoutStore = require('./stores/shouts/store'),
	userActions = require('./stores/user/actions'),
	shoutActions = require('./stores/shouts/actions');


module.exports = function (router, user, data) {
	var stores = {
		user: new UserStore({
			router: router,
			user: user
		}),
		shouts: new ShoutStore(data)
	};

	var actions = merge({}, userActions, shoutActions);

	var flux = new Fluxxor.Flux(stores,actions);

	flux.serialize = function() {
		var data = {};

		for(var store in stores) {
			if(stores.hasOwnProperty(store)) {
				data[store] = stores[store].serialize();
			}
		}

		return JSON.stringify(data);
	};

	flux.hydrate = function(data) {
		for(var store in data) {
			if(data.hasOwnProperty(store)) {
				stores[store].hydrate(data[store]);
			}
		}
	};

	return flux;
};
