/* eslint no-console: 0 */
import request from '../utils/request';
import { createLocationSlug } from '../utils/LocationUtils';
import { parseApiError } from '../utils/APIUtils';
import { getValidIPv4Address } from '../utils/InternetUtils';

export default {
  name: 'location',
  read: (req, resource, { latlng = '0,0' }, config, callback) => {
    if (req.cookies.location) {
      try {
        const location = JSON.parse(req.cookies.location);
        if (location.country && location.state && location.city) {
          callback(null, { location });
          return;
        }
      } catch (e) {
        console.error('Cannot parse location from cookie', req.cookies.location, e);
      }
    }
    const remoteAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const ip = getValidIPv4Address(remoteAddress);
    const headers = {};
    if (ip) {
      headers['x-forwarded-for'] = ip;
    }
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
        if (location.city.match('amsterdam')) {
          console.warn('Location is Amsterdam!');
          console.warn('req.connection.remoteAddress', req.connection.remoteAddress);
          console.warn('req.headers["x-forwarded-for"]', req.headers['x-forwarded-for']);
          console.warn('ip address', ip);
          console.warn('sent headers', headers);
        }
        location.slug = createLocationSlug(location);
        return callback(null, { location });
      });
  },
};
