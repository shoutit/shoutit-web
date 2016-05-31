import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'notifications',
  read: (req, resource, { id, endpoint, pageSize = 20 }, config, callback) => {
    const url = endpoint || '/notifications';
    request
      .get(url)
      .query({ page_size: pageSize })
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
