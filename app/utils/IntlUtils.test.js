/* eslint-env mocha */

import { expect } from 'chai';
import * as IntlUtils from './IntlUtils';
import { languages } from '../config';

describe('utils/IntlUtils', () => {
  describe('locales loaders', () => {
    languages.forEach(language => {
      it(`should export a function to load ${language}`, () => {
        expect(IntlUtils.locales[language]).to.be.a('Function');
      });
    });
  });
});
