import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';
let cache;

export function setCache(body) {
  cache = body;
}

export function getCache() {
  return cache;
}

export default {
  name: 'currencies',
  read: (req, resource, params, config, callback) => {
    const cache = getCache();
    if (cache) {
      callback(null, cache);
      return;
    }
    request
      .get('/misc/currencies')
      .prefix()
      .use(req)
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        setCache(res.body);
        return callback(null, res.body);
      });
  },
};
