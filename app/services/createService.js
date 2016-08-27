import template from 'lodash/template';
import debug from 'debug';

import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

const cachedResponses = {};

export function clearCache(serviceName, locale = 'en') {
  if (!cachedResponses.hasOwnProperty('serviceName')) {
    return;
  }
  delete cachedResponses[serviceName][locale];
}

export function setCache(serviceName, body, locale = 'en') {
  cachedResponses[serviceName] = {
    [locale]: body,
  };
}

export function getCache(serviceName, locale = 'en') {
  if (!cachedResponses[serviceName]) {
    return undefined;
  }
  return cachedResponses[serviceName][locale];
}

function createReadMethod({ url, cacheResponse, name }) {
  const log = debug(`shoutit:services:${name}/read`);
  return function readService(req, resource, params = {}, config, callback) {

    let requestUrl;
    if (params.endpoint) {
      requestUrl = params.endpoint;
    } else {
      requestUrl = template(url)(params);
    }
    log('Sending request to %s...', requestUrl);
    const cache = getCache(name, req.language);
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
        log('Received response from %s', requestUrl);
        if (err) {
          return callback(parseApiError(err));
        }
        if (cacheResponse) {
          setCache(name, res.body, req.language);
        }
        return callback(null, res.body);
      });
  };
}

/**
 * Shorthand to create fetchr services.
 *
 * @export
 * @param {Object} { name, read, cacheResponse = false }
 * @returns
 */

export default function createService({ name, read, cacheResponse = false }) {
  const service = { name };

  if (read) {
    service.read = createReadMethod({ url: read, cacheResponse, name });
  }

  return service;
}
