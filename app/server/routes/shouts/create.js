/**
 * Created by Philip on 27.02.2015.
 */

module.exports = function (client) {
	return function (req, res) {
		client.create(req.session, req.body)
			.on('success', function (data) {
				res.json(data);
			})
			.on('fail', function (data, resp) {
				res.status(resp.statusCode).json(data);
			})
			.on('error', function (err) {
				console.error(err);
				res.status(500).send(err);
			});
	}
};
