/**
 * Created by Philip on 15.04.2015.
 */

var ShoutClient = require("../../resources");

var express = require("express"),
        router = express.Router();

router.route("/:term")
  .get(require("./searchAll")(ShoutClient));


module.exports = router;


