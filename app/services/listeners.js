import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'listeners',
  read: (req, resource, { user }, config, callback) => {
    request
      .get(`/profiles/${user.username}/listeners`)
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
