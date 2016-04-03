import request from '../utils/request';
import { parseErrorResponse } from '../utils/APIUtils';

export default {
  name: 'home',
  read: (req, resource, params = {}, config, callback) => {
    const url = params.endpoint || '/profiles/me/home';
    request
      .get(url)
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
