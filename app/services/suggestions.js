import request from "../utils/request";

export default {
  name: "suggestions",
  read: (req, resource, { type, location }, config, callback) => {

    location = {
      country: null,
      state: null,
      city: null,
      ...location
    };

    const { country, state, city } = location;

    request
      .get("/misc/suggestions")
      .query({ type })
      .query({ country })
      .query({ state })
      .query({ city })
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(err);
        }
        return callback(null, res.body);
      });
  }
};
