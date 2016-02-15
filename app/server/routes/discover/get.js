/**
 * Retrieve a DiscoverItem.
 **/
module.exports = function (client) {
  return function (req, res) {
    client.get(req.session, req.params.pk, req.query)
            .on("success", function (data) {
              res.json(data);
            })
            .on("fail", function (data, resp) {
              res.status(resp.statusCode).json(data);
            })
            .on("error", function (err) {
              console.error(err);
              res.status(500).send(err);
            });
  };
};
