
module.exports = function (client) {
	return function (req, res) {
		client.change(req.session, req.body)
			.on('success', function (data) {
				console.error(data);
				console.error('success');
				res.json(data);
			})
			.on('fail', function (data, resp) {
				console.error(data);
				console.error('fail');
				res.status(resp.statusCode).json(data);
			})
			.on('error', function (err) {
				console.error(err);
				res.status(500).send(err);
			});
	};
};