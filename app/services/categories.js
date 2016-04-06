import request from '../utils/request';
import { parseErrorResponse } from '../utils/APIUtils';
let cache;
export default {
  name: 'categories',
  read: (req, resource, params, config, callback) => {
    if (cache) {
      callback(null, cache);
      return;
    }
    request
      .get('/shouts/categories')
      .prefix()
      .setSession(req.session)
      .end((err, res) => {
        if (err) {
          return callback(parseErrorResponse(err));
        }
        cache = res.body;
        return callback(null, res.body);
      });
  },
};
