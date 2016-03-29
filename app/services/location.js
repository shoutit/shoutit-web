import request from '../utils/request';
import { createLocationSlug } from '../utils/LocationUtils';
import { parseErrorResponse } from '../utils/APIUtils';

export default {
  name: 'location',
  read: (req, resource, { latlng = '0,0' }, config, callback) => {
    request
      .get('/misc/geocode')
      .query({ latlng })
      .setSession(req.session)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseErrorResponse(err));
        }
        const location = res.body;
        location.slug = createLocationSlug(location);
        return callback(null, location);
      });
  },
};
