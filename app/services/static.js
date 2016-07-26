import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'static',
  tos: (req, resource, params, config, callback) => {
    request
      .get(`/static/tos.html`)
      .use(req)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err, { resource, params, url: req.url }));
        }
        return callback(null, res.body);
      });
  },
}
