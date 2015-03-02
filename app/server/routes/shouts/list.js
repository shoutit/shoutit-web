/**
 * Created by Philip on 27.02.2015.
 */

module.exports = function (client) {
	return function (req, res) {
		client.list(req.session)
			.on('complete', function (resp) {
				res.json(resp.body);
			});
	}
};
