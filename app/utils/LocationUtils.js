import kebabCase from 'lodash/string/kebabCase';
import request from 'superagent';
import { camelizeKeys } from 'humps';
import round from 'lodash/math/round';
import { toTitleCase } from '../utils/StringUtils';

import { googleMapsKey } from '../config';
import { countries } from '../../assets/countries/countries-en.json';

export function createLocationSlug({ country = 'no-country', state = 'no-state', city = 'no-city' }) {
  return `${kebabCase(country)}_${kebabCase(state)}_${kebabCase(city)}`;
}

export function parseGeocoderResult(result) {
  let location = {
    latitude: null,
    longitude: null,
    country: null,
    state: null,
    city: null,
  };
  if (result.geometry && result.geometry.location) {
    location = {
      ...location,
      latitude: round(result.geometry.location.lat, 6),
      longitude: round(result.geometry.location.lng, 6),
    };
  }
  if (result.addressComponents) {
    result.addressComponents.forEach(address => {
      if (address.types.indexOf('country') > -1) {
        location.country = address.shortName;
      } else if (address.types.indexOf('locality') > -1) {
        location.city = address.shortName;
      } else if (address.types.indexOf('administrative_area_level_1') > -1) {
        location.state = address.shortName;
      }
    });
  }
  location = {
    ...location,
    slug: createLocationSlug(location),
  };
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
  const code = Object.keys(countries).find(code =>
    countries[code].toLowerCase() === name.toLowerCase()
  );
  if (!code) {
    return null;
  }
  return code.toLowerCase();
}

export function getLocationPath(location) {
  let path = '';
  if (location.country && getCountryName(location.country)) {
    path += `/${location.country.toLowerCase()}`;
    if (location.state) {
      path += `/${encodeURIComponent(location.state).toLowerCase()}`;
      if (location.city) {
        path += `/${encodeURIComponent(location.city).toLowerCase()}`;
      }
    }
  }
  return path;
}

export function formatLocation(location, options) {
  options = {
    useAddress: false,
    ...options,
  };
  const values = [];
  if (options.useAddress) {
    if (location.address) {
      values.push(location.address);
    }
    if (location.postal_code) {
      values.push(location.postal_code);
    }
  }
  if (location.city) {
    values.push(toTitleCase(location.city));
  }
  if (location.state && location.state !== location.city) {
    values.push(toTitleCase(location.state));
  }
  if (location.country) {
    values.push(getCountryName(location.country));
  }
  return values.join(', ');
}
