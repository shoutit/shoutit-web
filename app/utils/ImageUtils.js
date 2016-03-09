
/* eslint no-console: 0 */

/* WARNING: ONLY FOR SERVER SIDE */

import path from "path";
import os from "os";
import fs from "fs";
import debug from "debug";
import gm from "gm";
import Imagemin from "imagemin";

const log = debug("shoutit:ImageUtils");

const imageMagick = gm.subClass({ imageMagick: true });

export function convertImageToJPEG(filePath, callback) {

  const ext = path.extname(filePath);

  if (ext === ".jpg") {
    log("%s is already a .jpg, no need to convert it.", filePath);
    callback(null, filePath);
    return;
  }

  const newFilePath = filePath.replace(ext, ".jpg");

  log("Converting %s to %s...", filePath, newFilePath);

  imageMagick(filePath)
    .background("white")
    .setFormat("jpg")
    .write(newFilePath, err => {
      if (err) {
        callback(err);
        return;
      }
      log("Success: %s has been converted to %s.", filePath, newFilePath);

      log("Deleting %s...", filePath);
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.error("Can't delete %s", filePath);
      }
      log("%s deleted.", filePath);

      callback(null, newFilePath);
    });

}

export function compressImage(filePath, callback) {
  const imagemin = new Imagemin();
  log("Compressing %s...", filePath);
  imagemin.src(filePath)
    .dest(os.tmpdir())
    .use(Imagemin.jpegtran({ progressive: true }))
    .run((err, files) => {
      if (err) {
        callback(err);
        return;
      }
      log("Success: compressed %s.", filePath);
      callback(null, files[0].path);
    });

}
