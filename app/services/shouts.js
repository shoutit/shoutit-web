import request from '../utils/request';

import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'shouts',
  read: (req, resource, params = {}, config, callback) => {
    const { endpoint, filters, ...query } = params;
    if (filters) {
      Object.keys(filters).forEach(slug => {
        query[slug] = filters[slug].join(',');
      });
    }
    const url = endpoint || '/shouts';
    request
      .get(url)
      .query(!endpoint ? query : null)
      .prefix()
      .camelizeResponseBody()
      .use(req)
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback(null, res.body);
      });
  },
};
