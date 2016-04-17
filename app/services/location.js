
import request from '../utils/request';
import { createLocationSlug } from '../utils/LocationUtils';
import { parseApiError } from '../utils/APIUtils';
import { getValidIPv4Address } from '../utils/InternetUtils';

export default {
  name: 'location',
  read: (req, resource, { latlng = '0,0' }, config, callback) => {
    const remoteAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const ip = getValidIPv4Address(remoteAddress);
    const headers = {};
    if (ip) {
      headers['x-forwarded-for'] = ip;
    }
    console.log('Location service - req.ip, %s, remoteAddress: %s, sent ip: %s', req.ip, remoteAddress, ip, headers);
    request
      .get('/misc/geocode')
      .query({ latlng })
      .set(headers)
      .setSession(req.session)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        const location = res.body;
        location.slug = createLocationSlug(location);
        return callback(null, { location });
      });
  },
};
