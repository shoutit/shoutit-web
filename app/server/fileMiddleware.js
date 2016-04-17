/* eslint no-console: 0 */
import path from 'path';
import fs from 'fs';
import last from 'lodash/array/last';

import createMulter from './createMulter';
import * as AWS from '../utils/AWS';
import { convertImageToJPEG } from '../utils/ImageUtils';
import { uploadResources } from '../config';

function uniqueFilenameFromUser(user) {
  return `${Date.now()}_${user.id}`;
}

export function fileUploadMiddleware(req, res) {
  const { resourceType } = req.params;

  if (Object.keys(uploadResources).indexOf(resourceType) === -1) {
    res.status(400).send('Resource type not valid.');
    return;
  }

  if (!req.session.user) {
    res.status(403).send('User is not logged in.');
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

  // if (req.body && req.body.data) {
  //   const filePath = path.join(tmpDir, `${filename}.jpg`);
  //   const buffer = new Buffer(req.body.dataImage.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  //   fs.writeFile(filePath, buffer, err => {
  //     if (err) {
  //       console.error('Cannot write file %s from buffer', filePath, err);
  //       res.status(500).send('Cannot use this content');
  //       return;
  //     }
  //     uploadToS3(filePath);
  //   });
  //   return;
  // }

  // Upload from form field
  //
  //
  console.log(filename, fieldname);

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

export function fileDeleteMiddleware(req, res) {
  const { name } = req.query;
  const { resourceType } = req.params;
  const { bucket } = uploadResources[resourceType];

  if (!req.session.user) {
    res.status(403).send('User session is required.');
    return;
  }
  if (!name) {
    res.status(400).send('A filename is required.');
    return;
  }
  if (last(name.split('_') !== req.session.user.id)) {
    res.status(403).send('Access denied.');
  }

  AWS.del({ keys: [name], bucket }, err => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.status(200).send('OK');
  });

}
