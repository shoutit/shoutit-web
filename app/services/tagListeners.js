import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'tagListeners',
  read: (req, resource, { slug, endpoint, query }, config, callback) => {
    const url = endpoint || `/tags/${slug}/listeners`;
    request
      .get(url)
      .query(query)
      .use(req)
      .prefix()
      .end((err, res) => {
        if (err) {
          callback(parseApiError(err));
          return;
        }
        callback(null, res.body);
      });
  },
};
