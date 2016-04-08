import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'conversations',

  read: (req, resource, { id }, config, callback) => {
    let url = '/conversations';
    if (id) {
      url += `/${id}`;
    }
    request
      .get(url)
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
      .del(`/conversations/${id}`)
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
