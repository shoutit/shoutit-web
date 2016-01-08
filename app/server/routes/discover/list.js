/**
 * List DiscoverItems based on country query param.
 **/
module.exports = function (client) {
    return function (req, res) {
        client.list(req.session, req.query.country)
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