/* eslint-env mocha */
import { expect } from 'chai';
import { getFilename } from "./StringUtils"; // eslint-disable-line

describe('StringUtils', () => {
  describe('getFilename', () => {
    it('should return the file name from a path', () => {
      expect(getFilename('/foo/bar.jpg')).to.eql('bar.jpg');
    });
  });
});
