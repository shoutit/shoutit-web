/**
 * Created by Philip on 22.06.2015.
 */

var SUBROUTE = 'notifications';

module.exports = function () {
	return {
		list: require('./list')(this, SUBROUTE),
		read: require('./read')(this, SUBROUTE),
		unread: require('./unread')(this, SUBROUTE),
		reset: require('./reset')(this, SUBROUTE)
	};
};
