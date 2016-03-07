
var ShoutClient = require("../../resources").discover();

var express = require("express"),
  router = express.Router();

router.route("/")
    .get(require("./list")(ShoutClient));

router.route("/:pk")
    .get(require("./get")(ShoutClient));


module.exports = router;


