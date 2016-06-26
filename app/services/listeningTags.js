import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'listeningTags',
  read: (req, resource, { username, endpoint }, config, callback) => {
    const url = endpoint || `/profiles/${username}/interests`;
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
