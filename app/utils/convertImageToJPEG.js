
/* eslint no-console: 0 */

/* WARNING: ONLY FOR SERVER SIDE */

import path from 'path';
import fs from 'fs';
import debug from 'debug';
import gm from 'gm';

const log = debug('shoutit:ImageUtils');

const imageMagick = gm.subClass({ imageMagick: true });

export default function convertImageToJPEG(filePath, callback) {

  const ext = path.extname(filePath);

  if (ext === '.jpg') {
    log('%s is already a .jpg, no need to convert it.', filePath);
    callback(null, filePath);
    return;
  }

  const newFilePath = filePath.replace(ext, '.jpg');

  log('Converting %s to %s...', filePath, newFilePath);

  imageMagick(filePath)
    .background('white')
    .setFormat('jpg')
    .write(newFilePath, err => {
      if (err) {
        callback(err);
        return;
      }
      log('Success: %s has been converted to %s.', filePath, newFilePath);

      log('Deleting %s...', filePath);
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.error("Can't delete %s", filePath);
      }
      log('%s deleted.', filePath);

      callback(null, newFilePath);
    });
}
