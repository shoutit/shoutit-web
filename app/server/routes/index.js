/**
 * Created by Philip on 27.02.2015.
 */


var express = require('express'),
	apiRouter = express.Router();

apiRouter.use('/shouts', require('./shouts'));
apiRouter.use('/users', require('./users'));
apiRouter.use('/tags', require('./tags'));
// TODO Fix SearchAll Client
//apiRouter.use('/search', require('./search'));

module.exports = apiRouter;
