import request from "../utils/request";

export default {
  name: "conversations",
  read: (req, resource, params, config, callback) => {
    request
      .get("/conversations")
      .setSession(req.session)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(err);
        }
        return callback(null, res.body);
      });
  }
};
