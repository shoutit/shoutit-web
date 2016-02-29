
var SUBROUTE = "tags";

module.exports = function () {
  return {
    get: require("./get")(this, SUBROUTE),
    list: require("./list")(this, SUBROUTE),
    listen: require("./listen")(this, SUBROUTE),
    unlisten: require("./unlisten")(this, SUBROUTE),
    getListeners: require("./getListeners")(this, SUBROUTE),
    getRelated: require("./getRelated")(this, SUBROUTE)
  };
};

