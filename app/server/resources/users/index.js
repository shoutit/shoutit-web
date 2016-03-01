/**
 * Created by Philip on 27.02.2015.
 */

var SUBROUTE = "users";

module.exports = function () {
  return {
    me: require("./me")(this, SUBROUTE),
    get: require("./get")(this, SUBROUTE),
    search: require("./search")(this,SUBROUTE),
    del: require("./delete")(this, SUBROUTE),
    update: require("./update")(this, SUBROUTE),
    updateImage: require("./updateImage")(this,SUBROUTE),
    listen: require("./listen")(this,SUBROUTE),
    unlisten: require("./unlisten")(this, SUBROUTE),
    getListeners: require("./getListeners")(this,SUBROUTE),
    getListening: require("./getListening")(this,SUBROUTE),
    sendMessage: require("./sendMessage")(this,SUBROUTE)
  };
};

