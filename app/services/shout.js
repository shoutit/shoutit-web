import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'shout',
  create: (req, resource, params, shout, config, callback) => {
    request
      .post('/shouts')
      .prefix()
      .setSession(req.session)
      .send(shout)
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback(null, res.body);
      });
  },
  read: (req, resource, { id }, config, callback) => {
    request
      .get(`/shouts/${id}`)
      .setSession(req.session)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback(null, res.body);
      });
  },
  update: (req, resource, { id }, shout, config, callback) => {
    request
      .patch(`/shouts/${id}`)
      .prefix()
      .setSession(req.session)
      .send(shout)
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback(null, res.body);
      });
  },
};
