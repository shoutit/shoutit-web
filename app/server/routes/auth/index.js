/**
 * Created by Philip on 27.03.2015.
 */

var ShoutClient = require('../../resources').auth();

var express = require('express'),
	router = express.Router();

router.route('/change_password')
	.post(require('./changePassword')(ShoutClient));


module.exports = router;
