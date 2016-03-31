import request from '../utils/request';
import { parseErrorResponse } from '../utils/APIUtils';

export default {
  name: 'home',
  read: (req, resource, { username }, config, callback) => {
    request
      .get('/profiles/me/home')
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
