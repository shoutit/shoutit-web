import request from "../utils/request";

export default {
  name: "geocode",
  read: (req, resource, { latlng="0,0" }, config, callback) => {
    request
      .get("/misc/geocode")
      .query({ latlng })
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
