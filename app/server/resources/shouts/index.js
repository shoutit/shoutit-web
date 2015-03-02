/**
 * Created by Philip on 27.02.2015.
 */

var SUBROUTE = 'shouts';

module.exports = function() {
	return {
		list: require('./list')(this, SUBROUTE)
	};
};


