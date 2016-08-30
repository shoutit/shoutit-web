import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'setPassword',
  create: (req, resource, params, { newPassword, resetToken }, config, callback) => {
    request
      .post('/auth/set_password')
      .use(req)
      .prefix()
      .camelizeResponseBody()
      .send({
        reset_token: resetToken,
        new_password: newPassword,
        new_password2: newPassword,
      })
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback(null, res.body);
      });
  },
};
