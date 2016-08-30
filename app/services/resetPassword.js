import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'resetPassword',
  create: (req, resource, params, { email }, config, callback) => {
    request
      .post('/auth/reset_password')
      .send({ email })
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
