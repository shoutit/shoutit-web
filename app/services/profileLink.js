import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'profileLink',
  update: (req, resource, params, body, config, callback) => {
    request
      .patch('/profiles/me/link')
      .send(body)
      .setSession(req.session)
      .prefix()
      .end(err => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback();
      });
  },
};
