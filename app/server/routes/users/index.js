/**
 * Created by Philip on 27.03.2015.
 */

var ShoutClient = require('../../resources').users();

var express = require('express'),
	router = express.Router();

router.route('/:id')
	.get(require('./get')(ShoutClient))
	.post(require('./update')(ShoutClient));


module.exports = router;


