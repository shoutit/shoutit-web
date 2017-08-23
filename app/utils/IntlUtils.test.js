

import { expect } from 'chai';
import * as IntlUtils from './IntlUtils';
import { LANGUAGES } from '../config';

describe('utils/IntlUtils', () => {
  describe('locales loaders', () => {
    LANGUAGES.forEach(language => {
      it(`should export a function to load ${language}`, () => {
        expect(IntlUtils.locales[language]).to.be.a('Function');
      });
    });
  });
});
