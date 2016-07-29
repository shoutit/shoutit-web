import fs from 'fs';
import { parseApiError } from '../utils/APIUtils';
// import * as AWS from '../utils/AWS';

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development' || !process.env.SHOUTIT_ENV;
const STATIC_RESOURCES_DIR = `${__dirname}/../../assets/static`;

export default {
  name: 'staticResource',
  read: (req, resource, { id }, config, callback) => {

    const fileName = `${id}.${req.locale}.html`;

    if (IS_DEVELOPMENT) {
      fs.readFile(`${STATIC_RESOURCES_DIR}/${fileName}`, 'utf8', (err, data) => {
        if (err) {
          return callback(parseApiError(err));
        }
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
