import request from '../utils/request';
import { parseErrorResponse } from '../utils/APIUtils';

let cache;
export default {
  name: 'currencies',
  read: (req, resource, params, config, callback) => {
    if (cache) {
      return callback(null, cache);
    }
    request
      .get('/misc/currencies')
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseErrorResponse(err));
        }
        cache = res.body;
        return callback(null, res.body);
      });
  }
};
