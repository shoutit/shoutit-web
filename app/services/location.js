/* eslint no-console: 0 */
import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'location',
  update: (req, resource, params, { location }, config, callback) => {
    req.geolocation = location;
    if (req.session.user) {
      request
        .patch('/profiles/me')
        .send({ location })
        .use(req)
        .prefix()
        .end((err, res) => {
          if (err) {
            return callback(parseApiError(err));
          }
          req.session.user = res.body; // eslint-disable-line
          return callback(null, res.body);
        });
    } else {
      callback();
    }
  },
};
