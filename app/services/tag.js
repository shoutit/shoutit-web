import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'tag',
  read: (req, resource, { id }, config, callback) => {
    request
      .get(`/tags/${id}`)
      .setSession(req.session)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback(null, res.body);
      });
  },
};
