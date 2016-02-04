/**
 * Created by Philip on 27.02.2015.
 */
var rest = require("restler");
var ENDPOINT_SERVER = process.env.API_URL;

console.log("API_URL:", process.env.API_URL);

var ShoutitClient = rest.service(function (endpoint) {
	    this.defaults.headers = {
		    "Accept": "application/json",
		    "Content-Type": "application/json"
	};
	    this.baseURL = endpoint;
}, {}, {
	    shouts: require("./shouts"),
	    discover: require("./discover"),
	    users: require("./users"),
	    tags: require("./tags"),
	//search: require('./search'),
	    misc: require("./misc"),
	    pusher: require("./pusher"),
	    notifications: require("./notifications"),
	    conversations: require("./conversations"),
	    messages: require("./messages"),
	    auth: require("./auth")
});

module.exports = new ShoutitClient(ENDPOINT_SERVER);

