import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'tags',
  read: (req, resource, params, config, callback) => {
    request
      .get('/tags')
      .use(req)
      .query(params)
      .prefix()
      .camelizeResponseBody()
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback(null, res.body);
      });
  },
};
