/**
 * Created by Philip on 22.06.2015.
 */

var SUBROUTE = "messages";

module.exports = function () {
	  return {
		  del: require("./delete")(this, SUBROUTE)
	};
};
