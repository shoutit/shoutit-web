/**
 * Created by Philip on 27.02.2015.
 */

module.exports = function() {
	return {
		me: require('./me')(this, 'users')
	};
};

