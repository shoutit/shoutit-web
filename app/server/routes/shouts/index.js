/**
 * Created by Philip on 27.02.2015.
 */

var ShoutClient = require('../../resources').shouts();

var express = require('express'),
	router = express.Router();

router.route('/')
	.get(require('./list')(ShoutClient));

module.exports = router;


