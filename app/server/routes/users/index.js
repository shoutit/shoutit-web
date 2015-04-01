/**
 * Created by Philip on 27.03.2015.
 */

var ShoutClient = require('../../resources').users();

var express = require('express'),
	router = express.Router();

router.route('/:id')
	.get(require('./get')(ShoutClient))
	.post(require('./update')(ShoutClient));

router.route('/:id/listeners')
	.get(require('./getListeners')(ShoutClient));

router.route('/:id/listening')
	.get(require('./getListening')(ShoutClient));

router.route('/:id/listen')
	.post(require('./listen')(ShoutClient))
	.del(require('./unlisten')(ShoutClient));


module.exports = router;


