import request from '../utils/request';
export default function pusherMiddleware(req, res, next) { // eslint-disable-line
  request
    .post('/pusher/auth')
    .setSession(req.session)
    .send(req.body)
    .prefix()
    .end((err, response) => {
      if (err) {
        console.error(err, ); // eslint-disable-line no-console
        res.status(err.status || 500).send(response ? response.body : err.message);
        return;
      }
      res.json(response.body);
    });
}
