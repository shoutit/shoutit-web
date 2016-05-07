/* eslint-env mocha */
import { expect } from 'chai';
import { getFilename, toTitleCase } from "./StringUtils"; // eslint-disable-line

describe('utils/StringUtils', () => {
  describe('getFilename', () => {
    it('should return the file name from a path', () => {
      expect(getFilename('/foo/bar.jpg')).to.eql('bar.jpg');
    });
  });
  describe('toTitleCase', () => {
    it('should change the case of multiple words', () => {
      expect(toTitleCase('word with spaces in it')).to.eql('Word With Spaces In It');
    });
    it('should change the case when string has dashes', () => {
      expect(toTitleCase('word-with-spaces-in it')).to.eql('Word-With-Spaces-In It');
    });
  });
});
