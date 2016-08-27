/* eslint consistent-return: 0, no-console: 0 */
import get from 'lodash/get';
import debug from 'debug';
import { toTitleCase } from '../utils/StringUtils';
import { getValidIPv4Address } from '../utils/InternetUtils';
import request from '../utils/request';
import { getCountryName, formatLocation } from '../utils/LocationUtils';

const geoRE = /^\/(search|discover)\/(\w{2})(\/([^\/]*))?(\/([^\/\?]*))?/;

const log = debug('shoutit:server:geolocationMiddleware');

export default function geoLocationMiddleware(req, res, next) {

  const matchesUrl = req.url.match(geoRE);
  if (matchesUrl && getCountryName(matchesUrl[2])) {
    req.geolocation = {
      country: matchesUrl[2],
    };
    if (matchesUrl[1] === 'search' && matchesUrl[4]) {
      req.geolocation.state = toTitleCase(decodeURIComponent(matchesUrl[4]));
    }
    if (matchesUrl[1] === 'search' && matchesUrl[6]) {
      req.geolocation.city = toTitleCase(decodeURIComponent(matchesUrl[6]));
    }
    log('Got geolocation from URL');
  } else if (get(req, 'session.user.location')) {
    req.geolocation = req.session.user.location;
    log('Got geolocation from logged profile');
  } else if (get(req, 'cookies.location')) {
    try {
      const geolocation = JSON.parse(req.cookies.location);
      if (geolocation.country && geolocation.state && geolocation.city) {
        req.geolocation = geolocation;
        log('Got geolocation from location cookie');
      }
    } catch (e) {
      console.error('Cannot parse location from cookie', e);
    }
  }

  if (req.geolocation) {
    req.geolocation = {
      ...req.geolocation,
      name: formatLocation(req.geolocation, { language: req.language }),
    };
    return next();
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
    .query({ latlng: '0,0' }) // will get location from ip passed from the headers
    .set(headers)
    .prefix()
    .end((err, res) => {
      if (!err) {
        const geolocation = res.body;
        req.geolocation = {
          ...geolocation,
          name: formatLocation(geolocation, { language: req.language }),
        };
        log('Got geolocation from ip address', ip, req.geolocation.slug);
      } else {
        console.warn('Couldn\'t get geolocation for %s', ip, err);
      }
      return next();
    });

}
