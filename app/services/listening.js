import request from '../utils/request';
import { parseErrorResponse } from '../utils/APIUtils';

export default {
  name: 'listening',
  read: (req, resource, { user, type = 'users' }, config, callback) => {
    request
      .get(`/users/${user.username}/listening`)
      .query({ type })
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseErrorResponse(err));
        }
        return callback(null, res.body);
      });
  }
};
