import request from "../utils/request";

export default {
  name: "currencies",
  read: (req, resource, params, config, callback) => {
    request
      .get("/misc/currencies")
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(err);
        }
        return callback(null, res.body);
      });
  }
};
