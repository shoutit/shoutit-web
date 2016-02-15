/* eslint no-console: 0 */

import debug from "debug";
const log = debug("shoutit:server:geocode");

export default function(client) {
  return (req, res) => {
    const options = {
      headers: {
        "X-Forwarded-For": req.connection.remoteAddress
      }
    };
    log("Sending X-Forwarded-For header: %s", req.connection.remoteAddress);
    client.geocode(req.session, req.query, options)
      .on("success", data => res.json(data))
      .on("fail", (data, response) => res.status(response.statusCode).json(data))
      .on("error", (err) => {
        console.error(err);
        res.status(500).send(err);
      });
  };
}
