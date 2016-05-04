/* eslint-env mocha */

import { expect } from 'chai';
import { getStyleBackgroundImage } from './DOMUtils';

describe('DOMUtils', () => {

  describe('getStyleBackgroundImage', () => {
    it('should return the pattern image if path does not exist', () => {
      expect(getStyleBackgroundImage().backgroundImage).to.contain('pattern');
      expect(getStyleBackgroundImage().backgroundRepeat).to.eql('repeat');
    });
    it('should use the passed path as image', () => {
      expect(getStyleBackgroundImage('foo').backgroundImage).to.contain('foo');
      expect(getStyleBackgroundImage('foo').backgroundRepeat).to.eql('no-repeat');
      expect(getStyleBackgroundImage('foo').backgroundSize).to.eql('cover');
      expect(getStyleBackgroundImage('foo').backgroundPosition).to.eql('center');
    });
    it('should adopt the given variation', () => {
      expect(getStyleBackgroundImage('foo', 'large').backgroundImage).to.contain('foo_large');
    });
  });

  describe('preventBodyScroll', () => {
    // (todo)
  });

});
