
var SUBROUTE = 'auth';

module.exports = function () {
	return {
		change: require('./changePassword')(this, SUBROUTE)
	};
};
