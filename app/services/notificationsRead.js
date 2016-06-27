import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'notificationsRead',
  create: (req, resource, { id }, body, config, callback) => {
    const url = `/notifications/${id}/read`;
    request
      .post(url)
      .use(req)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback(null, res.body);
      });
  },
};
