/* eslint-env mocha */

import { expect } from 'chai';
import { getObject, upload } from './AWS';

const bucket = 'shoutit-tests';

function getBucketKey() {
  return `mocha_test_${Date.now()}.txt`;
}

describe('AWS', () => {

  if (!process.env.SHOUTIT_S3_ACCESS_KEY || !process.env.SHOUTIT_S3_SECRET_KEY) {
    console.log("Won't run AWS tests without S3 Access and Secret keys"); // eslint-disable-line
    return;
  }

  describe('getObject', () => {
    it('should retrieve an object', done => {
      const key = getBucketKey();
      const body = 'Hello';

      upload({ body, bucket, key }, () => {
        getObject({ key, bucket }, (err, data) => {
          expect(err).to.be.null;
          expect(data.Body.toString()).to.equal(body);
          done();
        });
      });
    });
  });

  describe('upload', function testUpload() {
    this.timeout(5000);

    it('should upload a stream', done => {
      const key = getBucketKey();
      const body = 'Hello';

      upload({ body, bucket, key }, (err, data) => {
        expect(err).to.be.null;
        expect(data.key).to.equal(key);
        done();
      });
    });
  });
});
