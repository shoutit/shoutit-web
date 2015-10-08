
var ShoutClient = require('../../resources').misc();

var express = require('express'),
    router = new express.Router();

router.route('/geocode')
    .get(require('./geocode')(ShoutClient));


module.exports = router;
