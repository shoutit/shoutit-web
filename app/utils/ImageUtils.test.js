/* eslint-env mocha */

import { expect } from 'chai';
import os from 'os';
import fs from 'fs';
import path from 'path';

const tmp = os.tmpdir();

import { convertImageToJPEG } from './ImageUtils';

describe('ImageUtils', () => {

  describe('convertImageToJPEG', () => {
    let tempJPGFile;
    let tempPNGFile;

    beforeEach(() => {
      tempPNGFile = `${tmp}/shoutit-test-image_${Date.now()}.png`;
      tempJPGFile = `${tmp}/shoutit-test-image_${Date.now()}.jpg`;
      fs.writeFileSync(tempJPGFile, fs.readFileSync(`${__dirname}/../../assets/fixtures/sample.jpg`));
      fs.writeFileSync(tempPNGFile, fs.readFileSync(`${__dirname}/../../assets/fixtures/sample.png`));
    });

    afterEach(() => {
      fs.unlinkSync(tempJPGFile);
      try {
        fs.unlinkSync(tempPNGFile);
      } catch (e) { } // eslint-disable-line
    });

    it('should return the same image path if already a JPG', done => {
      convertImageToJPEG(tempJPGFile, (err, filePath) => {
        expect(filePath).to.equal(tempJPGFile);
        done();
      });
    });

    it('should return the a JPG image from a PNG image', done => {
      convertImageToJPEG(tempPNGFile, (err, filePath) => {
        expect(path.extname(filePath)).to.equal('.jpg');
        expect(
          filePath.substr(0, filePath.lastIndexOf('.'))
        ).to.equal(
          filePath.substr(0, tempPNGFile.lastIndexOf('.'))
        );
        done();
      });
    });

    it('should delete the old PNG image after converting', done => {
      convertImageToJPEG(tempPNGFile, () => {
        let exception;
        try {
          fs.lstatSync(tempPNGFile);
        } catch (e) {
          exception = e;
        }
        expect(exception).to.not.be.undefined; // file has been deleted
        done();
      });
    });


  });
});
