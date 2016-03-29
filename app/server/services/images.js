/* eslint no-console: 0 */
import path from 'path';
import os from 'os';
import fs from 'fs';

import createMulter from './createMulter';
import * as AWS from '../../utils/AWS';
import { convertImageToJPEG } from '../../utils/ImageUtils';
import { uploadResources } from '../../config';

const tmpDir = os.tmpdir();

function uniqueFilenameFromUser(user) {
  return `${Date.now()}_${user.id}`;
}

export function uploadImageMiddleware(req, res) {
  const { resourceType } = req.params;

  if (Object.keys(uploadResources).indexOf(resourceType) === -1) {
    res.status(400).send('Resource type not valid.');
    return;
  }

  if (!req.session.user) {
    res.status(403).send('User session is required.');
    return;
  }

  const { fieldname, bucket, cdn } = uploadResources[resourceType];
  const filename = uniqueFilenameFromUser(req.session.user);

  const uploadToS3 = (filePath) => {
    const key = path.basename(filePath);
    const body = fs.readFileSync(filePath);

    AWS.upload({ bucket, key, body }, (err, data) => {
      if (err) {
        console.error('Cannot upload image %s', filePath, err);
        res.status(500).send('Cannot upload this image.');
        return;
      }
      const url = `${cdn}/${data.key}`;
      res.set('Content-Type', 'text/plain').send(url);
      fs.unlink(filePath, err => {
        if (err) {
          console.error('Cannot delete %s', filePath, err);
        }
      });
    });
  };


  // upload from data image

  if (req.body && req.body.dataImage) {
    const filePath = path.join(tmpDir, `${filename}.jpg`);
    const buffer = new Buffer(req.body.dataImage.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    fs.writeFile(filePath, buffer, err => {
      if (err) {
        console.error('Cannot write file %s from buffer', filePath, err);
        res.status(500).send('Cannot use this content');
        return;
      }
      uploadToS3(filePath);
    });
    return;
  }

  // Upload from form field

  createMulter(filename, fieldname)(req, res, err => {

    if (err) {
      console.log(err);
      res.status(400).send('Cannot upload this file.');
      return;
    }
    if (!req.file) {
      res.status(400).send('Missing file in request, or file not valid.');
      return;
    }

    convertImageToJPEG(req.file.path, (err, filePath) => {
      if (err) {
        console.error('Cannot convert image %s', filePath, err);
        res.status(400).send('Cannot convert this image.');
        return;
      }
      uploadToS3(filePath);
    });
  });

}

export function deleteImageMiddleware(req, res) {
  const { fileName } = req.query;
  if (!req.session.user) {
    res.status(403).send('User session is required.');
    return;
  }
  if (!fileName) {
    res.status(400).send('A filename is required.');
    return;
  }
  // TODO: check user can delete image
  res.status(200).send('OK');
}
