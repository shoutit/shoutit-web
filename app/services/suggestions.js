import request from '../utils/request';
import { createLocationSlug } from '../utils/LocationUtils';
import { parseErrorResponse } from '../utils/APIUtils';

export default {
  name: 'suggestions',
  read: (req, resource, { type, location }, config, callback) => {

    location = {
      country: null,
      state: null,
      city: null,
      ...location,
    };

    const { country, state, city } = location;

    request
      .get('/misc/suggestions')
      .setSession(req.session)
      .query({ type })
      .query({ country })
      .query({ state })
      .query({ city })
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseErrorResponse(err));
        }
        const suggestions = res.body;
        suggestions.slug = createLocationSlug(location);
        return callback(null, suggestions);
      });
  },
};
