import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'listeners',
  read: (req, resource, { username, endpoint }, config, callback) => {
    const url = endpoint || `/profiles/${username}/listeners`;
    request
      .get(url)
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
