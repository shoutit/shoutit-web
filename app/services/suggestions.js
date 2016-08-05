import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'suggestions',
  read: (req, resource, { type, location, endpoint }, config, callback) => {
    let url = '/misc/suggestions';
    let query;
    if (endpoint) {
      url = endpoint;
    } else {
      query = { ...query, type };
      if (location) {
        query = { ...query, country: location.country };
      }
    }
    request
      .get(url)
      .query(query)
      .use(req)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        const suggestions = res.body;
        return callback(null, suggestions);
      });
  },
};
