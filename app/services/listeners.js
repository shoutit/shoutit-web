import request from "../utils/request";

export default {
  name: "listeners",
  read: (req, resource, { user }, config, callback) => {
    request
      .get(`/users/${user.username}/listeners`)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(err);
        }
        return callback(null, res.body);
      });
  }
};
