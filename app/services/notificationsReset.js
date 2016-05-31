import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'notificationsReset',
  create: (req, resource, { id }, body, config, callback) => {
    const url = '/notifications/reset';
    request
      .post(url)
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
