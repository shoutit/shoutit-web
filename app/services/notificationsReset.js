import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'notificationsReset',
  create: (req, resource, { id }, body, config, callback) => {
    const url = '/notifications/reset';
    request
      .post(url)
      .use(req)
      .prefix()
      .camelizeResponseBody()
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback(null, res.body);
      });
  },
};
