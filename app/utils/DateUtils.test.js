/* eslint-env mocha */

import { expect } from 'chai';
import moment from 'moment';
import * as DateUtils from './DateUtils';

describe('DateUtils', () => {
  describe('formatCreatedAt', () => {

    it('format correctly dates within the same day', () => {
      const now = moment('2013-11-08 15:23:33');
      const date = moment('2013-11-08 13:01:33');
      const formatted = DateUtils.formatCreatedAt(date, now);
      expect(formatted).to.equal('1:01 PM');
    });

    it('use current date as default now', () => {
      const formatted = DateUtils.formatCreatedAt(moment());
      expect(formatted).to.equal(moment().format('LT'));
    });

    it('accept unix dates', () => {
      const now = moment('2015-12-20 12:23');
      const date = 1450600460; // 2015-12-20 9:34AM
      const formatted = DateUtils.formatCreatedAt(date, now);
      expect(formatted).to.equal('9:34 AM');
    });

    it('format correctly dates within the same week', () => {
      const now = moment('2015-12-24'); // Thursday
      const date = moment('2015-12-23'); // Wednesday
      const formatted = DateUtils.formatCreatedAt(date, now);
      expect(formatted).to.equal('Wed');
    });

    it('format correctly dates within the same year', () => {
      const now = moment('2015-12-24 22:00'); // Thursday
      const date = moment('2015-12-17 23:59'); // Wednesday
      const formatted = DateUtils.formatCreatedAt(date, now);
      expect(formatted).to.equal('Dec 17');
    });

    it('format correctly dates within the last years', () => {
      const now = moment('2015-12-24 22:00'); // Thursday
      const date = moment('2013-12-17'); // Wednesday
      const formatted = DateUtils.formatCreatedAt(date, now);
      expect(formatted).to.equal('12/17/2013');
    });
  });
});
