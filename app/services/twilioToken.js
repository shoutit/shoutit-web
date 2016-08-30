import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'twilioToken',
  create: (req, resource, params, body, config, callback) => {
    request
      .post('/twilio/video_auth')
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
