import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'currentLocation',
  update: (req, resource, params, { location }, config, callback) => {
    req.session.currentLocation = location;
    if (req.session.profile) {
      request
        .patch('/profiles/me')
        .send({ location })
        .use(req)
        .prefix()
        .camelizeResponseBody()
        .end((err, res) => {
          if (err) {
            return callback(parseApiError(err));
          }
          const profile = res.body;
          if (profile.type === 'page') {
            req.session.page = profile;
          } else {
            req.session.profile = profile;
          }
          return callback(null, profile);
        });
    } else {
      callback();
    }
  },
};
