"use strict";

/**
 * Created by Philip on 17.02.2015.
 */

var Fluxxor = require("fluxxor");

module.exports = function () {
	var stores = {};

	var actions = {};

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
