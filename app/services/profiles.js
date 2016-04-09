import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'profiles',
  read: (req, resource, params, config, callback) => {
    request
      .get('/profiles')
      .query(params)
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
