/**
 * Created by Philip on 22.06.2015.
 */

var ShoutClient = require("../../resources").messages();

var express = require("express"),
	    router = new express.Router();

router.route("/:id")
	.delete(require("./delete")(ShoutClient));

module.exports = router;

