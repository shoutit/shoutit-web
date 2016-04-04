
import request from '../utils/request';
import { createLocationSlug } from '../utils/LocationUtils';
import { parseErrorResponse } from '../utils/APIUtils';
import { getValidIPv4Address } from '../utils/InternetUtils';

export default {
  name: 'location',
  read: (req, resource, { latlng = '0,0' }, config, callback) => {
    const remoteAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const ip = getValidIPv4Address(remoteAddress);
    const headers = {};
    if (ip) {
      headers['X-Forwarded-For'] = ip;
    }
    request
      .get('/misc/geocode')
      .query({ latlng })
      .set(headers)
      .setSession(req.session)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseErrorResponse(err));
        }
        const location = res.body;
        location.slug = createLocationSlug(location);
        return callback(null, { location });
      });
  },
};
