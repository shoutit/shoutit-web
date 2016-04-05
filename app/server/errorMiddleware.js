/* eslint no-console: 0 */

export default function errorMiddleware(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (err.status === 404 || err.statusCode === 404) {
    res.status(404).send('Not found');
  }
  console.log('Error on request %s %s', req.method, req.url);
  console.log(err.stack);
  // TODO: render server error with react
  res.status(err.status || err.statusCode || 500).send(`Something bad happened\n${err.message}\n<pre>${err.stack}</pre>`);
  if (err.domain) {
    console.log('Error was caught by a domain, consider to restart gracefully.');
  }
}
