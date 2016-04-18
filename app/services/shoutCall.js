import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'shoutCall',
  read: (req, resource, { shout }, config, callback) => {
    request
      .get(`/shouts/${shout.id}/call`)
      .setSession(req.session)
      .prefix()
      .end((err, res) => {
        if (err) {
          callback(parseApiError(err));
          return;
        }
        const data = {
          ...shout,
          mobile: res.body.mobile,
        };
        callback(null, data);
      });
  },
};
