
var ShoutClient = require("../../resources").auth();

var express = require("express"),
	  router = express.Router();

router.route("/change_password")
	.post(require("./changePassword")(ShoutClient));

router.route("/verify_email")
	.post(require("./verifyEmail")(ShoutClient));

module.exports = router;
