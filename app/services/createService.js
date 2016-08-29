import template from 'lodash/template';
import debug from 'debug';

import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

const cachedResponses = {};

/**
 * Clear the cache for a service and a locale.
 *
 * @export
 * @param {Any} serviceName
 * @param {String} [locale='en']
 * @returns
 */
export function clearCache(serviceName, locale = 'en') {
  if (!cachedResponses.hasOwnProperty('serviceName')) {
    return;
  }
  delete cachedResponses[serviceName][locale];
}

/**
 * Set the cache in memory for a service and a locale.
 *
 * @export
 * @param {String} serviceName
 * @param {Any} body
 * @param {string} [locale='en']
 */
export function setCache(serviceName, body, locale = 'en') {
  cachedResponses[serviceName] = {
    [locale]: body,
  };
}

/**
 * Return the cache for the service and the corrensponding locale
 *
 * @export
 * @param {String} serviceName
 * @param {String} [locale='en']
 * @returns {Any}
 */
export function getCache(serviceName, locale = 'en') {
  if (!cachedResponses[serviceName]) {
    return undefined;
  }
  return cachedResponses[serviceName][locale];
}

/**
 * Create a read method for fetchr.
 *
 * @param {Object} options
 * @returns {Function}
 */
function createReadMethod({ url, cacheResponse, name }) {
  const log = debug(`shoutit:services:${name}/read`);
  return function readService(req, resource, params = {}, config, callback) {

    let requestUrl;
    if (params.endpoint) {
      requestUrl = params.endpoint;
    } else {
      requestUrl = template(url)(params);
    }
    log('Sending request to %s...', requestUrl, params);
    const cache = getCache(name, req.session.language);
    if (cache) {
      log('Using response found in cache for %s', requestUrl);
      callback(null, cache);
      return;
    }
    request
      .get(requestUrl)
      .prefix()
      .query(params.query)
      .use(req)
      .end((err, res) => {
        log('%s response from %s', res && res.status, requestUrl, params);
        if (err) {
          return callback(parseApiError(err));
        }
        if (cacheResponse) {
          setCache(name, res.body, req.session.language);
        }
        return callback(null, res.body);
      });
  };
}

/**
 * Shorthand to create fetchr services.
 *
 * When specifying the `read` option:
 *
 * - the URL is automatically prefixed with our API address, e.g. /shout/test
 *   will send the request https://api.shoutit.com/shout/test
 * - if the service params contain a `query` object, it will be used as query string.
 * - if the service params contain a `endpoint` url, this will be used instead
 *   of the specified URL.
 * - you can use lodash template variable to replace values with the params
 *   sent to the service, e.g. `/shout/${id}` and send `params: { id: 'a_shout_id' }`
 *   to make a request to `/shout/a_shout_id`.
 *
 * @export
 * @param {Object} config
 * @param {String} config.name Required. The name of the service. Must be unique in fetchr.
 * @param {String} config.read The API endpoint URL to use in the read method requests.
 * @param {Bool}   config.cacheResponse Will cache the response and used for the next `read` requests.
 * @returns {Object} An object to register as fetchr service
 */

export default function createService({ name, read, cacheResponse = false }) {
  const service = { name };

  if (read) {
    service.read = createReadMethod({ url: read, cacheResponse, name });
  }

  return service;
}
