import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'tags',
  read: (req, resource, params, config, callback) => {
    request
      .get('/tags')
      .setSession(req.session)
      .query(params)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback(null, res.body);
      });
  },
};
