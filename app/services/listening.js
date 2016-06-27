import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'listening',
  read: (req, resource, { username, endpoint }, config, callback) => {
    const url = endpoint || `/profiles/${username}/listening`;
    request
      .get(url)
      .use(req)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback(null, res.body);
      });
  },
};
