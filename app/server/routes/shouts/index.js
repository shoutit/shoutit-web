/**
 * Created by Philip on 27.02.2015.
 */

var ShoutClient = require('../../resources').shouts();

var express = require('express'),
	router = express.Router();

router.route('/')
	.get(require('./list')(ShoutClient))
	.post(require('./create')(ShoutClient));

router.route('/:id')
	.get(require('./get')(ShoutClient))
	.delete(require('./delete')(ShoutClient));

router.route('/:id/reply')
	.post(require('./reply')(ShoutClient));

module.exports = router;


