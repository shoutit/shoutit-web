
var ShoutClient = require("../../resources").tags();

var express = require("express"),
  router = express.Router();

router.route("/")
  .get(require("./list")(ShoutClient));

router.route("/:id")
  .get(require("./get")(ShoutClient));

router.route("/:id/listen")
  .post(require("./listen")(ShoutClient))
  .delete(require("./unlisten")(ShoutClient));

router.route("/:id/listeners")
  .get(require("./getListeners")(ShoutClient));

router.route("/:id/related")
  .get(require("./getRelated")(ShoutClient));

module.exports = router;


