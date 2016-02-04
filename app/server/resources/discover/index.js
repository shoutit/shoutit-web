
var SUBROUTE = "discover";

module.exports = function () {
  return {
      get: require("./get")(this, SUBROUTE),
      list: require("./list")(this, SUBROUTE)
    };
};

