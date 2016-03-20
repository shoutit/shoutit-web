import request from "../utils/request";
import { createLocationSlug } from "../utils/LocationUtils";
import { parseErrorResponse } from "../utils/APIUtils";

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
          return callback(parseErrorResponse(err));
        }
        const suggestion = res.body;
        suggestion.slug = createLocationSlug(location);
        return callback(null, suggestion);
      });
  }
};
