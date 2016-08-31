import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'conversationRead',

  create: (req, resource, { id }, body, config, callback) => {
    request
      .post(`/conversations/${id}/read`)
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

  delete: (req, resource, { id }, config, callback) => {
    request
      .delete(`/conversations/${id}/read`)
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
