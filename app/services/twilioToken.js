import request from "../utils/request";

export default {
  name: "twilioToken",
  create: (req, resource, params, body, config, callback) => {
    request
      .post(`/twilio/video_auth`)
      .setSession(req.session)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(err);
        }
        callback(null, res.body);
      });
  }
};
