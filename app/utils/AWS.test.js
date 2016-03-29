/* eslint-env mocha */

import { expect } from 'chai';
import { upload } from './AWS';

describe('AWS', () => {

  if (!process.env.SHOUTIT_S3_ACCESS_KEY || !process.env.SHOUTIT_S3_SECRET_KEY) {
    console.log("Won't run AWS tests without S3 Access and Secret keys"); // eslint-disable-line
    return;
  }

  describe('upload', function () {
    this.timeout(5000);

    it('should upload a stream', done => {
      const key = `mocha_test_${Date.now()}.txt`;
      upload({
        body: 'Hello!',
        bucket: 'shoutit-tests',
        key,
      }, (err, data) => {
        expect(err).to.be.null;
        expect(data.key).to.equal(key);
        done();
      });
    });

  });

});
