/* eslint consistent-return: 0, no-console: 0 */
import { getValidIPv4Address } from '../utils/InternetUtils';
import debug from 'debug';
import request from '../utils/request';
import { createLocationSlug } from '../utils/LocationUtils';

const log = debug('shoutit:geolocationMiddleware');
export default function geoLocationMiddleware(req, res, next) {
  if (req.session && req.session.user && req.session.user.location) {
    req.geolocation = {
      ...req.session.user.location,
      slug: createLocationSlug(req.session.user.location),
    };
    log('Got geolocation from logged profile: %s', req.geolocation.slug);
    return next();
  }

  if (req.cookies && req.cookies.location) {
    try {
      const geolocation = JSON.parse(req.cookies.location);
      if (geolocation.country && geolocation.state && geolocation.city) {
        req.geolocation = {
          ...geolocation,
          slug: createLocationSlug(geolocation),
        };
        log('Got geolocation from location cookie: %s', req.geolocation.slug);
        return next();
      }
    } catch (e) {
      console.error('Cannot parse location from cookie', e);
    }
  }

  // Detect location from client's remote address
  const remoteAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const ip = getValidIPv4Address(remoteAddress);
  const headers = {};
  if (ip) {
    headers['x-forwarded-for'] = ip;
  }
  request
    .get('/misc/geocode')
    .query({ latlng: '0,0' })
    .set(headers)
    .prefix()
    .end((err, res) => {
      if (!err) {
        req.geolocation = {
          ...res.body,
          slug: createLocationSlug(res.body),
        };
        log('Got geolocation from ip address: %s', req.geolocation.slug);
      } else {
        console.warn('Couldn\'t get geolocation for %s', ip, err);
      }
      return next();
    });

}
