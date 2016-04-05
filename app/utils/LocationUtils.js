import kebabCase from 'lodash/string/kebabCase';
import request from 'superagent';
import { camelizeKeys } from 'humps';
import { googleMapsKey } from '../config';
import { countries } from '../../assets/countries/countries-en.json';

export function createLocationSlug({ country = 'no-country', state = 'no-state', city = 'no-city' }) {
  return `${kebabCase(country)}_${kebabCase(state)}_${kebabCase(city)}`;
}

export function parseGeocoderResult(result) {
  const location = {
    latitude: result.geometry.location.lat,
    longitude: result.geometry.location.lng,
    country: null,
    state: null,
    city: null,
  };
  result.addressComponents.forEach(address => {
    if (address.types.indexOf('country') > -1) {
      location.country = address.shortName;
    } else if (address.types.indexOf('locality') > -1) {
      location.city = address.shortName;
    } else if (address.types.indexOf('administrative_area_level_1') > -1) {
      location.state = address.shortName;
    }
  });

  return location;
}

export function geocodePlace(placeId, callback) {
  request.get('https://maps.googleapis.com/maps/api/geocode/json')
    .query({
      place_id: placeId,
      language: 'en',
      key: googleMapsKey,
    })
    .end((err, res) => {
      if (err) {
        console.error(err); // eslint-disable-line
        callback(err);
        return;
      }
      if (res.body.status !== 'OK') {
        console.error(res.body); // eslint-disable-line
        callback(res.body);
        return;
      }
      callback(null, parseGeocoderResult(camelizeKeys(res.body.results[0])));
    });
}

export function getCountryName(code) {
  return countries[code.toUpperCase()];
}

export function getCountryCode(name) {
  const code = Object.keys(countries).find(code => countries[code].toLowerCase() === name.toLowerCase());
  if (!code) {
    return null;
  }
  return code.toLowerCase();
}
