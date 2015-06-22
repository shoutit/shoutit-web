/**
 * Created by Philip on 22.06.2015.
 */

var ShoutClient = require('../../resources').conversations();

var express = require('express'),
	router = new express.Router();

router.route('/')
	.get(require('./list')(ShoutClient));

router.route('/:id')
	.delete(require('./delete')(ShoutClient));

router.route('/:id/messages')
	.get(require('./messages')(ShoutClient));

router.route('/:id/read')
	.post(require('./read')(ShoutClient))
	.delete(require('./unread')(ShoutClient));

router.route('/:id/reply')
	.post(require('./reply')(ShoutClient));

module.exports = router;

