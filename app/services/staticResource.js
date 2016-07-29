import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'staticResource',
  read: (req, resource, { id, searchParams, location }, config, callback) => {
    let url = '/static_resources';
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
      .use(req)
      .type('html')
      .prefix('http://localhost:3000') // TODO detect the environment
      .query(query)
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback(null, {
          content: res.text,
        });
      });
  },
};
