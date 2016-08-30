import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'tagListen',
  create: (req, resource, { tag }, body, config, callback) => {
    request
      .post(`/tags/${tag.slug}/listen`)
      .use(req)
      .prefix()
      .camelizeResponseBody()
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback(null, res.body);
      });
  },
  delete: (req, resource, { tag }, config, callback) => {
    request
      .del(`/tags/${tag.slug}/listen`)
      .use(req)
      .prefix()
      .camelizeResponseBody()
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback(null, res.body);
      });
  },
};
