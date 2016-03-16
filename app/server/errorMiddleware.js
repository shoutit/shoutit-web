/* eslint no-console: 0 */

export default function errorMiddleware(err, req, res, next) {  // eslint-disable-line no-unused-vars
  console.log("Error on request %s %s", req.method, req.url);
  console.log(err);
  console.log(err.stack);
  // TODO: render server error with react
  res.status(500).send("Something bad happened");
}
