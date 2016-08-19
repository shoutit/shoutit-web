/* eslint-env mocha */
import { expect } from 'chai';
import { getFilename, toTitleCase, removeParamsFromUrl } from "./StringUtils"; // eslint-disable-line

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
    it('should change the case when string has unicode letters', () => {
      expect(toTitleCase('müllheim nrw')).to.eql('Müllheim Nrw');
    });
  });
  describe('removeParamsFromUrl', () => {
    it('should return the url without param', () => {
      const url = 'http://example.com/test/?foo=bar';
      const newUrl = 'http://example.com/test/';
      expect(removeParamsFromUrl(url, 'foo')).to.equal(newUrl);
    });
    it('should return the url for params without a value', () => {
      const url = 'http://example.com/test/?foo';
      const newUrl = 'http://example.com/test/';
      expect(removeParamsFromUrl(url, 'foo')).to.equal(newUrl);
    });
    it('should return an url with other params stripping the ?', () => {
      const url = 'http://example.com/test/?bar=foo&foo=bar';
      const newUrl = 'http://example.com/test/?bar=foo';
      expect(removeParamsFromUrl(url, 'foo')).to.equal(newUrl);
    });
    it('should return an url with other params stripping the &', () => {
      const url = 'http://example.com/test/?foo=bar&bar=foo';
      const newUrl = 'http://example.com/test/?bar=foo';
      expect(removeParamsFromUrl(url, 'foo')).to.equal(newUrl);
    });
  });
});
