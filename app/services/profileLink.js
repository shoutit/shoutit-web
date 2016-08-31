import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'profileLink',
  update: (req, resource, params, body, config, callback) => {
    request
      .patch('/profiles/me/link')
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
