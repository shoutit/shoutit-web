import request from '../utils/request';
import { parseErrorResponse } from '../utils/APIUtils';

export default {
  name: 'discover',
  read: (req, resource, { id, searchParams }, config, callback) => {
    let url = '/discover';
    if (id) {
      url += `/${id}`;
    }
    request
      .get(url)
      .query({ searchParams })
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseErrorResponse(err));
        }
        return callback(null, res.body);
      });
  },
};
