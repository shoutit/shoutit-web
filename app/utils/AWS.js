/* eslint no-console: 0 */

/* WARNING: ONLY FOR SERVER SIDE */

import AWS from "aws-sdk";
import debug from "debug";

const log = debug("shoutit:AWS");

AWS.config.region = "eu-west-1";
AWS.config.logger = { log };
AWS.config.accessKeyId = process.env.SHOUTIT_S3_ACCESS_KEY;
AWS.config.secretAccessKey = process.env.SHOUTIT_S3_SECRET_KEY;

export function upload({ body: Body, key: Key, bucket: Bucket }, done) {
  const s3 = new AWS.S3();
  const params = { Bucket, Body, Key };

  log("Uploading %s to %s...", Key, Bucket);

  s3.upload(params, (err, data) => {
    if (err) {
      console.error(err);
      done && done(err);
      return;
    }
    log("Upload success for %s", Key, data);
    done && done(null, data);
  });
}
