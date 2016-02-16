/* eslint no-console: 0 */
import path from "path";
import fs from "fs";

import createMulter from "./createMulter";
import { upload as S3upload } from "../../utils/AWS";
import { convertImageToJPEG, compressImage } from "../../utils/ImageUtils";

export function uploadImageMiddleware(req, res) {
  const { resourceType } = req.params;

  if (["shout", "tag", "user"].indexOf(resourceType) === -1) {
    res.status(400).send("Resource type not valid.");
    return;
  }
  // if (!req.session.user) {
  //   res.status(403).send("User session is required.");
  //   return;
  // }

  let fieldName, bucket, cdn;
  switch (resourceType) {
  case "shout":
    fieldName = "shout_image";
    bucket = "shoutit-shout-image-original";
    cdn = "https://shout-image.static.shoutit.com";
    break;
  }
  const uploadImage = createMulter({ id: "test" });

  uploadImage.single(fieldName)(req, res, err => {

    if (err) {
      console.log(err);
      res.status(500).send("Cannot upload this file.");
      return;
    }
    if (!req.file) {
      res.status(400).send("Missing file in request, or file not valid.");
      return;
    }

    convertImageToJPEG(req.file.path, (err, filePath) => {
      if (err) {
        console.error("Cannot convert image %s", filePath, err);
        res.status(500).send("Cannot convert this image.");
        return;
      }

      compressImage(filePath, (err, filePath) => {
        if (err) {
          console.error(err);
          res.status(500).send("Cannot compress this image.");
          return;
        }
        const key = path.basename(filePath);
        const body = fs.readFileSync(filePath);

        S3upload({ bucket, key, body}, (err, data) => {
          if (err) {
            console.error("Cannot upload image %s", filePath, err);
            res.status(500).send("Cannot upload this image.");
            return;
          }
          const url = `${cdn}/${data.key}`;
          res.send(url);

          fs.unlink(filePath, err => {
            if (err) {
              console.error("Cannot delete %s", filePath, err);
              return;
            }
          });

        });
      });
    });
  });

}

export function deleteImageMiddleware(req, res) {
  const { fileName } = req.query;
  if (!req.session.user) {
    res.status(403).send("User session is required.");
    return;
  }
  if (!fileName) {
    res.status(500).send("A filename is required.");
    return;
  }
  // TODO: check user can delete image
  res.status(200).send("OK");
}
