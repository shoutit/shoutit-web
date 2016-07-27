import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'staticPages',
  read: (req, resource, params, config, callback) => {
    request
      .get(`/static/tos.html`)
      .use(req)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err, { resource, params, url: req.url }));
        }
	console.log('response', response, 'responsebodybitch', response.body)
        return callback(null, res);
      });
  },
}
