/**
 * Created by Philip on 09.03.2015.
 */

module.exports = function (client, path) {
	return function () {
		return client.get(path + '/currencies');
	}
};
