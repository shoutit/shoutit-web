import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'discover',
  read: (req, resource, { id, searchParams, location }, config, callback) => {
    let url = '/discover';
    if (id) {
      url += `/${id}`;
    }
    let query = searchParams;
    if (location) {
      query = {
        ...searchParams,
        ...location,
      };
    }
    request
      .get(url)
      .setSession(req.session)
      .prefix()
      .query(query)
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback(null, res.body);
      });
  },
};
