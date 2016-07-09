import request from '../utils/request';

import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'shouts',
  read: (req, resource, params = {}, config, callback) => {
    const { endpoint, ...query } = params;
    const url = endpoint || '/shouts';
    request
      .get(url)
      .query(!endpoint ? query : null)
      .prefix()
      .use(req)
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback(null, res.body);
      });
  },
};
