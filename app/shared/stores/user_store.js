"use strict";

/**
 * Created by Philip on 17.02.2015.
 */

var UserStore = Fluxxor.createStore({
	actions: {},

	serialize: function() {
		return JSON.stringify(this.state);
	},

	hydrate: function(json) {
		this.state = JSON.parse(json);
	}
});

module.exports = UserStore;