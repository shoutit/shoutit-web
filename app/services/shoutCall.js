import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'shoutCall',
  read: (req, resource, { id }, config, callback) => {
    request
      .get(`/shouts/${id}/call`)
      .setSession(req.session)
      .prefix()
      .end((err, res) => {
        if (err) {
          callback(parseApiError(err));
          return;
        }
        callback(null, res.body);
      });
  },
};
