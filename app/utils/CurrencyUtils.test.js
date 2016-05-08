/* eslint-env mocha */

import { expect } from 'chai';
import * as CurrencyUtils from './CurrencyUtils';

describe('CurrencyUtils', () => {
  describe('formatPrice', () => {
    it('should return "free" for falsy price', () => {
      expect(CurrencyUtils.formatPrice(null)).to.equal('free');
      expect(CurrencyUtils.formatPrice(0)).to.equal('free');
      expect(CurrencyUtils.formatPrice('')).to.equal('free');
    });
    it('should convert cents in units', () => {
      expect(CurrencyUtils.formatPrice(100, 'EUR')).to.equal('1 €');
      expect(CurrencyUtils.formatPrice(120, 'EUR')).to.equal('1,20 €');
    });
  });
});
