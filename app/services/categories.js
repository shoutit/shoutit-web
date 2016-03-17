import request from "../utils/request";

export default {
  name: "categories",
  read: (req, resource, params, config, callback) => {
    request
      .get("/misc/categories")
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(err);
        }
        return callback(null, res.body);
      });
  }
};
