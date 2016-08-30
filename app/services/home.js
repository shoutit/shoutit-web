import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'home',
  read: (req, resource, params = {}, config, callback) => {
    const url = params.endpoint || '/profiles/me/home';
    request
      .get(url)
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
