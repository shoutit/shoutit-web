import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'relatedShouts',
  read: (req, resource, { shoutId, endpoint, query }, config, callback) => {
    const url = endpoint || `/shouts/${shoutId}/related`;
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
