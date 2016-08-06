/* eslint-env mocha */

import { expect } from 'chai';
import { backgroundImageStyle } from './DOMUtils';

describe('DOMUtils', () => {

  describe('backgroundImageStyle', () => {
    it('should return the pattern image if path does not exist', () => {
      expect(backgroundImageStyle().backgroundImage).to.contain('pattern');
      expect(backgroundImageStyle().backgroundRepeat).to.eql('repeat');
    });
    it('should use the passed path as image', () => {
      expect(backgroundImageStyle({ url: 'foo' }).backgroundImage).to.contain('foo');
      expect(backgroundImageStyle({ url: 'foo' }).backgroundRepeat).to.eql('no-repeat');
      expect(backgroundImageStyle({ url: 'foo' }).backgroundSize).to.eql('cover');
      expect(backgroundImageStyle({ url: 'foo' }).backgroundPosition).to.eql('center');
    });
    it('should adopt the given variation', () => {
      expect(backgroundImageStyle({ url: 'foo', variation: 'large' }).backgroundImage).to.contain('foo_large');
    });
  });

  describe('preventBodyScroll', () => {
    // (todo)
  });

});
