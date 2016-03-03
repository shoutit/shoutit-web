import request from "../utils/request";
import logger from "superagent-logger";

export default {
  name: "profile",
  read: (req, resource, { username }, config, callback) => {
    request
      .get(`/profiles/${username}`)
      .setSession(req.session)
      .prefix()
      .use(logger)
      .end((err, res) => {
        if (err) {
          return callback(err);
        }
        return callback(null, res.body);
      });
  }
};
