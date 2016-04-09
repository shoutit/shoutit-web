/* eslint no-console: 0 */

export default function errorMiddleware(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (err.status === 404 || err.statusCode === 404) {
    res.status(404).send('Not found');
    return;
  }
  if (err.status === 401 || err.statusCode === 401) {
    if (req.url.indexOf('/login') === -1) {
      // redirect to login page
      res.redirect(`/login?after=${req.url}`);
      return;
    }
  }
  console.log('Error on request %s %s', req.method, req.url);
  console.log(err.stack);

  res.status(err.status || err.statusCode || 500)
    .send(`<h1>Something bad happened</h1>
<p>${err.message}</p>
<pre>${process.env.NODE_ENV === 'development' ? err.stack : null}</pre>
`);
  if (err.domain) {
    console.log('Error was caught by a domain, consider to restart gracefully.');
  }
}
