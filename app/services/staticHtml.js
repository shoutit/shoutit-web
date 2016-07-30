import has from 'lodash/has';
import omit from 'lodash/omit';
import fs from 'fs';
import { parseApiError } from '../utils/APIUtils';
// import * as AWS from '../utils/AWS';

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development' || !process.env.SHOUTIT_ENV;
const STATIC_RESOURCES_DIR = `${__dirname}/../../assets/static`;

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
  read: (req, resource, { id }, config, callback) => {

    let cachedContent = undefined;
    const filePrefix = `${id}.${req.locale}`;
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

    if (IS_DEVELOPMENT) {
      fs.readFile(`${STATIC_RESOURCES_DIR}/${fileName}`, 'utf8', (err, data) => {
        if (err) {
          return callback(parseApiError(err));
        }

        cache(filePrefix, data);

        return callback(null, {
          content: data,
        });
      });
    }

    // TODO Define a bucket in config/index uploadResources
    // AWS.getObject({
    //   fileName,
    //   bucket,
    // }, (err, data) => {
    //   return callback(err, {
    //     content: data.Body.toString(),
    //   });
    // });
  },
};
