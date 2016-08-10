/* eslint no-console: 0 */

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
  log('Caching page "%s" (%s) with content', pageName, locale, content.substring(0, 50));
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

export function getObjectFromAWS(key) {
  return new Promise((resolve, reject) => {
    AWS.getObject({
      key,
      bucket: s3Buckets.staticPages.bucket,
    }, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}

export default {
  name: 'staticHtml',
  read: (req, resource, { pageName }, config, callback) => {

    log('Getting page "%s" (%s)...', pageName, req.language);

    if (req.query.hasOwnProperty('invalidateCache')) {
      invalidateCache(pageName);
    }

    const content = getCachedContent(pageName, req.language);
    if (content) {
      log('Page "%s" (%s) found in cache, will skip AWS request', pageName, req.language);
      callback(null, { content });
      return;
    }
    const key = `${pageName}.${req.language}.html`;
    getObjectFromAWS(key)
      .then(data => data, reason => {
        log('Error retrieving key %s, trying english version...', key, reason.message);
        return getObjectFromAWS(`${pageName}.en.html`);
      })
      .then(data => {
        const content = data.Body.toString();
        cacheContent(pageName, req.language, content);
        callback(null, { content });
      })
      .catch(err => {
        console.error(err);
        callback(err);
      });
  },
};
