import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'tagListeners',
  read: (req, resource, { name, endpoint, query }, config, callback) => {
    const url = endpoint || `/tags/${name}/listeners`;
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
