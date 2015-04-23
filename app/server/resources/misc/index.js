/**
 * Created by Philip on 27.02.2015.
 */

var SUBROUTE = 'misc';

module.exports = function() {
	return {
		currencies: require('./currencies')(this, SUBROUTE),
		sortTypes: require('./shoutSortTypes')(this, SUBROUTE)
	};
};


