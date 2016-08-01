/* eslint no-console: 0 */

/* WARNING: ONLY FOR SERVER SIDE */

import AWS from 'aws-sdk';
import debug from 'debug';

const log = debug('shoutit:AWS');

AWS.config.region = 'eu-west-1';
AWS.config.logger = { log };
AWS.config.accessKeyId = process.env.SHOUTIT_S3_ACCESS_KEY;
AWS.config.secretAccessKey = process.env.SHOUTIT_S3_SECRET_KEY;

export function getObject({ key: Key, bucket: Bucket }, callback) {
  const s3 = new AWS.S3();
  const params = { Bucket, Key };

  s3.getObject(params, (err, data) => {
    err ? console.error(err) : log('getObject success for %s from %s', Key, Bucket);
    callback(err, data);
  });
}

export function upload({ body: Body, key: Key, bucket: Bucket, contentType: ContentType }, callback) {
  const s3 = new AWS.S3();
  const params = { Bucket, Body, Key, ContentType };

  log('Uploading %s to %s...', Key, Bucket);

  s3.upload(params, (err, data) => {
    if (err) {
      console.error(err);
      if (callback) {
        callback(err);
      }
      return;
    }
    log('Upload success for %s', Key, data);
    if (callback) {
      callback(null, data);
    }
  });
}

export function del({ keys, bucket: Bucket }, callback) {
  const s3 = new AWS.S3();
  const Objects = keys.map(Key => ({ Key }));
  const params = { Bucket, Delete: { Objects } };

  log('Deleting objects from %s...', Bucket, Objects);

  s3.deleteObjects(params, (err, data) => {
    if (err) {
      console.error(err);
      if (callback) {
        callback(err);
      }
      return;
    }
    log('Delete success', Objects);
    if (callback) {
      callback(null, data);
    }
  });
}
