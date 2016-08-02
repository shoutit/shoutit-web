import { parseApiError } from '../utils/APIUtils';
import * as AWS from '../utils/AWS';
import { s3Buckets } from '../config';
import debug from 'debug';

const log = debug('shoutit:services:staticHtml');

let staticCache = {};
/*
Example of a cached object:
{
  tos: {
    de: 'html_content',
    en: 'html_content,
  }
  pageName: {
    it: 'html_content',
    de: 'html_content,
  }
}
*/
export function cacheContent(pageName, locale, content) {
  log('Caching page "%s" (locale) with content', pageName, content.substring(0, 50));
  if (!staticCache.hasOwnProperty(pageName)) {
    staticCache[pageName] = {};
  }
  staticCache[pageName][locale] = content;
}

export function getCachedContent(pageName, locale) {
  if (!staticCache.hasOwnProperty(pageName)) {
    return undefined;
  }
  return staticCache[pageName][locale];
}

export function invalidateCache(pageName) {
  if (!pageName) {
    staticCache = {};
    return;
  }
  log('Invalidating cache for %s', pageName);
  delete staticCache[pageName];
}

export default {
  name: 'staticHtml',
  read: (req, resource, { pageName }, config, callback) => {

    log('Getting page "%s" (%s)...', pageName, req.locale);

    if (req.query.hasOwnProperty('invalidateCache')) {
      invalidateCache(pageName);
    }

    const content = getCachedContent(pageName, req.locale);
    if (content) {
      log('Page "%s" (%s) found in cache, will skip AWS request', pageName, req.locale);
      callback(null, { content });
      return;
    }

    AWS.getObject({
      bucket: s3Buckets.static.bucket,
      key: `${pageName}.${req.locale}.html`,
    }, (err, data) => {
      if (err) {
        callback(parseApiError(err));
        return;
      }
      const content = data.Body.toString();
      cacheContent(pageName, req.locale, content);
      callback(null, { content });
    });
  },
};
