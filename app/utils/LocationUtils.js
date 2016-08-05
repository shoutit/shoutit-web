import request from 'superagent';
import { camelizeKeys } from 'humps';
import round from 'lodash/round';

import { googleMapsKey, locales } from '../config';

const countries = {};

// This should be removed by #127431039
locales.forEach(locale => {
  countries[locale] = require(`../../assets/countries/countries.${locale}.json`).countries;
});

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
        location.city = address.longName;
      } else if (address.types.indexOf('administrative_area_level_1') > -1) {
        location.state = address.longName;
      }
    });
  }
  return location;
}


/**
 * Geocode a place obtained from Google Maps API
 *
 * @export
 * @param {any} placeId
 * @param {any} language
 * @return {Promise} A promise resolved with a location object
 */
export function geocodePlace(placeId, language) {

  return new Promise((resolve, reject) => {
    request.get('https://maps.googleapis.com/maps/api/geocode/json')
      .query({
        language,
        place_id: placeId,
        key: googleMapsKey,
      })
      .end((err, res) => {
        if (err) {
          console.error(err); // eslint-disable-line
          reject(err);
          return;
        }
        if (res.body.status !== 'OK') {
          console.error(res.body); // eslint-disable-line
          reject(res.body);
          return;
        }
        const parsedResult = parseGeocoderResult(camelizeKeys(res.body.results[0]));
        resolve(parsedResult);
      });
  });

}

export function getCountryName(code, locale = 'en') {
  if (!(locale in countries)) {
    locale = 'en';
  }
  return countries[locale][code.toUpperCase()];
}

export function getCountryCode(name, locale = 'en') {
  if (!(locale in countries)) {
    locale = 'en';
  }
  const code = Object.keys(countries[locale]).find(code =>
    countries[locale][code].toLowerCase() === name.toLowerCase()
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
    showCountry: true,
    locale: 'en',
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
    values.push(location.city);
  }
  if (location.state && location.state !== location.city) {
    values.push(location.state);
  }
  if ((options.showCountry || options.useAddress || !location.state || !location.city) && location.country) {
    values.push(getCountryName(location.country, options.locale));
  }
  return values.join(', ');
}
