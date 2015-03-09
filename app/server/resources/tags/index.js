/**
 * Created by Philip on 27.02.2015.
 */

var SUBROUTE = 'tags';

module.exports = function () {
	return {
		search: require('./search')(this,SUBROUTE),
		get: require('./get')(this,SUBROUTE),
		listen: require('./listen')(this,SUBROUTE),
		unlisten: require('./unlisten')(this,SUBROUTE),
		getListeners: require('./getListeners')(this,SUBROUTE),
		getShouts: require('./getShouts')(this,SUBROUTE)
	};
};

