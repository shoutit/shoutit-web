/* eslint-env mocha */

import { expect } from 'chai';
import * as IntlUtils from './IntlUtils';
import { locales } from '../config';

describe('utils/IntlUtils', () => {
  describe('locales loaders', () => {
    locales.forEach(locale => {
      it(`should export a function to load ${locale}`, () => {
        expect(IntlUtils.locales[locale]).to.be.a('Function');
      });
    });
  });
});
