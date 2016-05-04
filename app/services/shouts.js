import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'shouts',
  read: (req, resource, params = {}, config, callback) => {
    const url = params.endpoint || '/shouts';

    let query;
    if (!params.endpoint && params.searchParams) {
      query = params.searchParams;
      if (query && query.filters) {
        Object.keys(query.filters).forEach(slug => {
          query[slug] = query.filters[slug];
        });
        delete query.filters;
      }
      if (req.geolocation) {
        query = {
          ...query,
          ...req.geolocation,
        };
      }
    }

    request
      .get(url)
      .query(query)
      .prefix()
      .setSession(req.session)
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback(null, res.body);
      });
  },
};
