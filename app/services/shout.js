import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'shout',
  create: (req, resource, params, body, config, callback) => {
  },
  read: (req, resource, { id }, config, callback) => {
    request
      .get(`/shouts/${id}`)
      .setSession(req.session)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback(null, res.body);
      });
  },
  update: (req, resource, params, body, config, callback) => {
  },
};
