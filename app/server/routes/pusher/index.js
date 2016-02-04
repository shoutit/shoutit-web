/**
 * Created by Philip on 22.06.2015.
 */

var ShoutClient = require("../../resources").pusher();

var express = require("express"),
	  router = new express.Router();

router.route("/auth")
	.post(require("./auth")(ShoutClient));

module.exports = router;
