import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'messagesRead',
  create: (req, resource, { id }, body, config, callback) => {
    request
      .post(`/messages/${id}/read`)
      .use(req)
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
      .delete(`/messages/${id}/read`)
      .use(req)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback(null, res.body);
      });
  },

};
