import omit from 'lodash/omit';
import { parseApiError } from '../utils/APIUtils';
import * as AWS from '../utils/AWS';
import { s3Buckets } from '../config';
import debug from 'debug';

const log = debug('shoutit:services:staticHtml');

let staticCache = {};

const cache = (filePrefix, data) => {
  log('Caching %s with content', filePrefix, data.substring(0, 50));
  staticCache = {
    ...staticCache,
    [filePrefix]: data,
  };
};

const invalidateCache = pageKey => {
  staticCache = { ...omit(staticCache, pageKey) };
};

export default {
  name: 'staticHtml',
  read: (req, resource, { pageName, resourceType }, config, callback) => {

    log('Getting %s (%s)...', pageName, req.locale);

    const { bucket } = s3Buckets[resourceType];

    let cachedContent = undefined;
    const filePrefix = `${pageName}.${req.locale}`;
    const fileSuffix = '.html';
    const fileName = `${filePrefix}${fileSuffix}`;

    if (req.query.hasOwnProperty('invalidateCache')) {
      invalidateCache(filePrefix);
    }

    cachedContent = staticCache[filePrefix];

    if (cachedContent) {
      log('%s (%s) found in cache, will skip AWS request', pageName, req.locale);
      callback(null, {
        content: cachedContent,
      });
      return;
    }

    AWS.getObject({
      key: fileName,
      bucket,
    }, (err, data) => {
      let content = undefined;

      if (err) {
        callback(parseApiError(err));
        return;
      }

      content = data.Body.toString();
      cache(filePrefix, content);

      callback(null, {
        content,
      });
    });
  },
};
