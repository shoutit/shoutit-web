import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'listening',
  read: (req, resource, { user, type = 'users' }, config, callback) => {
    request
      .get(`/profiles/${user.username}/listening`)
      .setSession(req.session)
      .query({ type })
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        res.body.results = res.body[type];
        return callback(null, res.body);
      });
  },
};
