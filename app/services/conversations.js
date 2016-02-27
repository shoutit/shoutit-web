import request from "../utils/APIRequest";

export default {
  name: "conversations",
  read: (req, resource, params, config, callback) => {
    request
      .get("/conversations")
      .setSession(req.session)
      .end((err, res) => {
        if (err) {
          return callback(err);
        }
        return callback(null, res.body);
      });
  }
};
