import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'tag',
  read: (req, resource, { name }, config, callback) => {
    request
      .get(`/tags/${name}`)
      .use(req)
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
