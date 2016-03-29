import request from '../utils/request';
import { parseErrorResponse } from '../utils/APIUtils';

export default {
  name: 'twilioToken',
  create: (req, resource, params, body, config, callback) => {
    request
      .post('/twilio/video_auth')
      .setSession(req.session)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseErrorResponse(err));
        }
        callback(null, res.body);
      });
  }
};
