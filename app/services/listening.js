import request from "../utils/request";

export default {
  name: "listening",
  read: (req, resource, { user, type="users" }, config, callback) => {
    request
      .get(`/users/${user.username}/listening`)
      .query({ type })
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(err);
        }
        return callback(null, res.body);
      });
  }
};
