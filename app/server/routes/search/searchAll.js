/**
 * Created by Philip on 15.04.2015.
 */

module.exports = function (client) {
        return function (req, res) {
          client.search().search(client, req.session, req.params.term)
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
