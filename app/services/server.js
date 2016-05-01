import fs from 'fs';
import path from 'path';
let cache;
export default {
  name: 'server',
  read: (req, resource, param, config, callback) => {
    if (cache) {
      callback(null, cache);
      return;
    }
    fs.readFile(path.resolve(__dirname, '../../CURRENT_TAG'), 'utf8', (err, data) => {
      if (err) {
        console.error(err); // eslint-disable-line
      }
      cache = {
        currentTag: data,
      };
      callback(null, cache);
    });
  },
};
