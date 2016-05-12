import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'listen',
  create: (req, resource, { username }, body, config, callback) => {
    request
      .post(`/profiles/${username}/listen`)
      .setSession(req.session)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback(null, res.body);
      });
  },
  delete: (req, resource, { username }, config, callback) => {
    request
      .del(`/profiles/${username}/listen`)
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
