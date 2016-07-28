import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';
import { staticResourceUrl } from '../config';

export default {
  name: 'staticResource',
  read: (req, resource, { id, searchParams, location }, config, callback) => {
    let url = '';

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
      .prefix(staticResourceUrl)
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
