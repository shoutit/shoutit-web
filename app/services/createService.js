import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

const cachedResponses = {};

export function clearCache(serviceName) {
  delete cachedResponses[serviceName];
}

export function setCache(serviceName, body) {
  cachedResponses[serviceName] = body;
}

export function getCache(serviceName) {
  return cachedResponses[serviceName];
}

function createReadMethod({ url, cacheResponse, name }) {
  return function readService(req, resource, params, config, callback) {
    const cache = getCache(name);
    if (cache) {
      callback(null, cache);
      return;
    }
    request
      .get(url)
      .prefix()
      .use(req)
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        if (cacheResponse) {
          setCache(name, res.body);
        }
        return callback(null, res.body);
      });
  };
}

export default function createService({ name, read, cacheResponse = false, methods = ['read'] }) {
  const service = { name };

  methods.forEach(method => {
    switch (method) {
      case 'read':
        service.read = createReadMethod({ url: read, cacheResponse, name });
        break;
      default:
        break;
    }
  });
  return service;
}
