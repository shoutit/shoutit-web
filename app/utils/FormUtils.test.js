/* eslint-env mocha */
import { expect } from 'chai';
import { areEquals } from './FormUtils';

describe('FormUtils', () => {

  describe('areEquals', () => {
    it('should return true when values do not match', () => {
      expect(areEquals([1, 2], [3, 3])).to.be.true;
    });

    it('should return false when value do match', () => {
      expect(areEquals([1, 1], [2, 2])).to.be.false;
    });
  });
});
