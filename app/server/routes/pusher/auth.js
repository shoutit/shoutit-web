/* eslint no-console: 0 */
export default function  (client) {
  return function (req, res) {
    client.auth(req.session, req.body)
      .on("success", function (data) {
        res.json(data);
      })
      .on("fail", function (data, resp) {
        console.warn("APIServer", "responded with " + resp.statusCode);
        res.status(resp.statusCode).json(data);
      })
      .on("error", function (err) {
        console.error(err);
        res.status(500).send(err);
      });
  };
}
