/* eslint no-console: 0 */
export default function (client) {
  return function (req, res) {
    client.shuffleCategories(req.session, req.query)
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
}
