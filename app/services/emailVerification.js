import { camelizeKeys } from 'humps';

import request from '../utils/request';
import { setRequestSession } from '../services/session';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'emailVerification',
  create: (req, resource, params, { email }, config, callback) => {
    request
      .post('/auth/verify_email')
      .use(req)
      .send({ email })
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback(null, res.body);
      });
  },
  read: (req, resource, { token }, config, callback) => {
    request
      .get('/auth/verify_email')
      .query({ token })
      .use(req)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        setRequestSession(req, camelizeKeys(res.body));
        return callback(null, res.body);
      });
  },
};
