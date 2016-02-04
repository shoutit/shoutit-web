
var SUBROUTE = "auth";

module.exports = function () {
	      return {
		      change: require("./changePassword")(this, SUBROUTE),
		      verify: require("./verifyEmail")(this, SUBROUTE)
	};
};
