import request from '../utils/request';
import { parseErrorResponse } from '../utils/APIUtils';

export default {
  name: 'listen',
  create: (req, resource, { user }, body, config, callback) => {
    request
      .post(`/profiles/${user.username}/listen`)
      .setSession(req.session)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseErrorResponse(err));
        }
        return callback(null, res.body);
      });
  },
  delete: (req, resource, { user }, config, callback) => {
    request
      .del(`/profiles/${user.username}/listen`)
      .setSession(req.session)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseErrorResponse(err));
        }
        return callback(null, res.body);
      });
  },
};
