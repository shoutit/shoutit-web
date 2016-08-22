import template from 'lodash/template';

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
  return function readService(req, resource, params = {}, config, callback) {
    const cache = getCache(name, req.language);
    if (cache) {
      callback(null, cache);
      return;
    }
    url = template(url)(params);
    request
      .get(url)
      .prefix()
      .query(params.query)
      .use(req)
      .end((err, res) => {
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
