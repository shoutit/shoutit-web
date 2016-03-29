import request from '../utils/request';
import { parseErrorResponse } from '../utils/APIUtils';

export default {
  name: 'listeners',
  read: (req, resource, { user }, config, callback) => {
    request
      .get(`/users/${user.username}/listeners`)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseErrorResponse(err));
        }
        return callback(null, res.body);
      });
  },
};
