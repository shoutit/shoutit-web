import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'conversationRead',

  create: (req, resource, { id }, body, config, callback) => {
    request
      .post(`/conversations/${id}/read`)
      .setSession(req.session)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback(null, res.body);
      });
  },

  delete: (req, resource, { id }, config, callback) => {
    request
      .delete(`/conversations/${id}/read`)
      .setSession(req.session)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback(null, res.body);
      });
  },

};
