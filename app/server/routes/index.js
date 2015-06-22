/**
 * Created by Philip on 27.02.2015.
 */


var express = require('express'),
	apiRouter = new express.Router();

apiRouter.use('/shouts', require('./shouts'));
apiRouter.use('/users', require('./users'));
apiRouter.use('/tags', require('./tags'));
apiRouter.use('/pusher', require('./pusher'));
apiRouter.use('/notifications', require('./notifications'));
apiRouter.use('/conversations', require('./conversations'));

// TODO Fix SearchAll Client
//apiRouter.use('/search', require('./search'));

module.exports = apiRouter;
