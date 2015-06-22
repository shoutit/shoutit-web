/**
 * Created by Philip on 22.06.2015.
 */

var ShoutClient = require('../../resources').notifications();

var express = require('express'),
	router = new express.Router();

router.route('/')
	.get(require('./list')(ShoutClient));

router.route('/:id/read')
	.post(require('./read')(ShoutClient))
	.delete(require('./unread')(ShoutClient));

router.route('/reset')
	.post(require('./reset')(ShoutClient));

module.exports = router;
