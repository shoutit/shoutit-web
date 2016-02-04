/**
 * Created by Philip on 27.02.2015.
 */

var SUBROUTE = "shouts";

module.exports = function () {
	      return {
		      list: require("./list")(this, SUBROUTE),
		      create: require("./create")(this, SUBROUTE),
		      get: require("./get")(this, SUBROUTE),
  getRelated: require("./get_related")(this, SUBROUTE),
		      del: require("./delete")(this, SUBROUTE),
		      reply: require("./reply")(this, SUBROUTE)
	};
};


