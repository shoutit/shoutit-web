/**
 * Created by Philip on 22.06.2015.
 */


var SUBROUTE = "pusher";

module.exports = function() {
	    return {
		    auth: require("./auth")(this, SUBROUTE)
	};
};

