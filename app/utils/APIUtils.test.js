

import { expect } from 'chai';
import { getVariation, getErrorLocations, getErrorsByLocation } from './APIUtils';

describe('APIUtils', () => {

  describe('getVariation', () => {

    it("should return the 'medium' variation as default", () => {
      const url = 'http://example.com/test.image.jpg';
      expect(getVariation(url)).to.equal('http://example.com/test.image_medium.jpg');
    });

    it('should work with any extension or variation', () => {
      const url = 'https://user-image.static.shoutit.com/1457599968825_30885ef7-d96a48e0-a75d-513678ffbbc3.png';
      expect(getVariation(url, 'foo')).to.equal('https://user-image.static.shoutit.com/1457599968825_30885ef7-d96a48e0-a75d-513678ffbbc3_foo.png');
    });

    it('should work for files without extension', () => {
      const url = 'http://example.com/test_image';
      expect(getVariation(url)).to.equal('http://example.com/test_image_medium');
    });
  });

  describe('getErrorLocations', () => {
    it('should return an empty array if the error has no `errors` key', () => {
      expect(getErrorLocations({ foo: 'bar ' })).to.eql([]);
    });
    it('should return an array of unique error locations', () => {
      const error = {
        errors: [
          { location: 'foo' },
          { location: 'bar' },
          { location: 'foo' },
        ],
      };
      expect(getErrorLocations(error)).to.eql(['foo', 'bar']);
    });
  });

  describe('getErrorsByLocation', () => {
    it('should return undefined if the error has no `errors` key', () => {
      expect(getErrorsByLocation({ foo: 'bar ' }, 'foo')).to.be.undefined;
    });
    it('should return all the errors for the given location', () => {
      const error = {
        errors: [
          { location: 'foo', message: 'abc' },
          { location: 'bar', message: 'gyp' },
          { location: 'foo', message: 'xyz' },
        ],
      };
      expect(getErrorsByLocation(error, 'foo')).to.be.eql([
        { location: 'foo', message: 'abc' },
        { location: 'foo', message: 'xyz' },
      ]);
      expect(getErrorsByLocation(error, 'bar')).to.be.eql([
        { location: 'bar', message: 'gyp' },
      ]);
    });
  });

});
