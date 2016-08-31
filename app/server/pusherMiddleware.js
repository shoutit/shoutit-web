import request from '../utils/request';

export default function pusherMiddleware(req, res, next) { // eslint-disable-line
  request
    .post('/pusher/auth')
    .use(req)
    .send(req.body)
    .prefix()
    .end((err, response) => {
      if (err) {
        console.error(err);
        res.status(err.status || 500).send(response ? response.body : err.message);
        return;
      }
      res.json(response.body);
    });
}
