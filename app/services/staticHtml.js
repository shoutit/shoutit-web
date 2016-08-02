import has from 'lodash/has';
import omit from 'lodash/omit';
import { parseApiError } from '../utils/APIUtils';
import * as AWS from '../utils/AWS';
import { uploadResources } from '../config';

let staticCache = {};

const cache = (filePrefix, data) => {
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

    const { bucket } = uploadResources[resourceType];

    let cachedContent = undefined;
    const filePrefix = `${pageName}.${req.locale}`;
    const fileSuffix = '.html';
    const fileName = `${filePrefix}${fileSuffix}`;
    const invalidate = has(req.query, 'invalidate');

    invalidate && invalidateCache(filePrefix);

    cachedContent = staticCache[filePrefix];

    if (cachedContent) {
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
