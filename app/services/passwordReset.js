import request from '../utils/request';
import { parseErrorResponse } from '../utils/APIUtils';

export default {
  name: 'passwordReset',
  create: (req, resource, params, { email }, config, callback) => {
    request
      .post('/auth/reset_password')
      .send({ email })
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseErrorResponse(err));
        }
        return callback(null, res.body);
      });
  }
};
