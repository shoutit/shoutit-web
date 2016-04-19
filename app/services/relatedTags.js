import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'relatedTags',
  read: (req, resource, { tag, endpoint, query }, config, callback) => {
    const url = endpoint || `/tags/${tag.name}/related`;
    request
      .get(url)
      .query(query)
      .setSession(req.session)
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