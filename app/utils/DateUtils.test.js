

import { expect } from 'chai';
import * as DateUtils from './DateUtils';

describe('DateUtils', () => {
  describe('isSameDay', () => {
    it('should return false if one day is falsy', () => {
      expect(DateUtils.isSameDay(new Date())).to.be.false;
      expect(DateUtils.isSameDay(undefined, new Date())).to.be.false;
    });
    it('should return true when two dates are in the same day', () => {
      expect(DateUtils.isSameDay(new Date(), new Date())).to.be.true;
    });
    it('should return false when two dates are in the same day', () => {
      expect(DateUtils.isSameDay(new Date(2016, 11, 10), new Date(2016, 11, 9))).to.be.false;
    });
  });

  describe('isSameWeek', () => {
    it('should return false if one day is falsy', () => {
      expect(DateUtils.isSameWeek(new Date())).to.be.false;
      expect(DateUtils.isSameWeek(undefined, new Date())).to.be.false;
    });
    it('should return true when two dates are in the same week', () => {
      expect(DateUtils.isSameWeek(new Date(2015, 12, 7), new Date(2015, 12, 3))).to.be.true;
    });
    it('should return false when two dates are not the same week', () => {
      expect(DateUtils.isSameWeek(new Date(2015, 12, 7), new Date(2015, 12, 14))).to.be.false;
    });
  });

  describe('isSameYear', () => {
    it('should return false if one day is falsy', () => {
      expect(DateUtils.isSameYear(new Date())).to.be.false;
      expect(DateUtils.isSameYear(undefined, new Date())).to.be.false;
    });
    it('should return true when two dates are in the same year', () => {
      expect(DateUtils.isSameYear(new Date(2015, 7, 7), new Date(2015, 3, 3))).to.be.true;
    });
    it('should return false when two dates are not in the same year', () => {
      expect(DateUtils.isSameYear(new Date(2016, 7, 7), new Date(2015, 3, 3))).to.be.false;
    });
  });

});
