import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'password',
  update: (req, resource, params, body, config, callback) => {
    request
      .post('/auth/change_password')
      .send(body)
      .use(req)
      .prefix()
      .camelizeResponseBody()
      .end(err => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback();
      });
  },
};
