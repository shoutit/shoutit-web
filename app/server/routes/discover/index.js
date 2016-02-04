
var ShoutClient = require("../../resources").discover();

var express = require("express"),
  router = express.Router();

router.route("/")
    .get(require("./list")(ShoutClient));

router.route("/:pk")
    .get(require("./get")(ShoutClient));

router.route("/:pk/shouts")
    .get(require("./listShouts")(ShoutClient));


module.exports = router;


