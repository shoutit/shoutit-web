/**
 * Created by Philip on 22.06.2015.
 */

var SUBROUTE = "conversations";

module.exports = function () {
	      return {
		      load: require("./list")(this, SUBROUTE),
		      messages: require("./messages")(this, SUBROUTE),
		      read: require("./read")(this, SUBROUTE),
		      unread: require("./unread")(this, SUBROUTE),
		      del: require("./delete")(this, SUBROUTE),
		      reply: require("./reply")(this, SUBROUTE)
	};
};

