/* eslint consistent-return: 0 */
import get from 'lodash/get';
import debug from 'debug';
import { toTitleCase } from '../utils/StringUtils';
import { getValidIPv4Address } from '../utils/InternetUtils';
import request from '../utils/request';

const geoRE = /^\/(search|discover)\/(\w{2})(\/([^\/]*))?(\/([^\/\?]*))?/;

const log = debug('shoutit:server:currentLocationMiddleware');

export default function geoLocationMiddleware(req, res, next) {

  const matchesUrl = req.url.match(geoRE);
  if (matchesUrl) {
    req.session.currentLocation = {
      country: matchesUrl[2],
    };
    if (matchesUrl[1] === 'search' && matchesUrl[4]) {
      req.session.currentLocation.state = toTitleCase(decodeURIComponent(matchesUrl[4]));
    }
    if (matchesUrl[1] === 'search' && matchesUrl[6]) {
      req.session.currentLocation.city = toTitleCase(decodeURIComponent(matchesUrl[6]));
    }
    log('Got geolocation from URL');
  } else if (get(req, 'session.profile.location')) {
    req.session.currentLocation = req.session.page ? req.session.page.location : req.session.profile.location;
    log('Got geolocation from logged profile');
  }

  if (req.session.currentLocation) {
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
      if (err) {
        console.warn('Couldn\'t get geolocation for %s', ip, err);
      }
      req.session.currentLocation = res.body;
      log('Got geolocation from ip address', ip, req.session.currentLocation.slug);
      next();
    });

}
