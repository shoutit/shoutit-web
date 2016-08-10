import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import { languages } from '../config';

describe('config', () => {
  describe('languages', () => {
    languages.forEach(language => {

      describe(language, () => {
        it('should have the translation file', done => {
          fs.stat(path.resolve(`assets/intl/translations/${language}.json`), err => {
            expect(err).to.be.null;
            done();
          });
        });
        it('should have the relative countries.json', () => {
          const json = require(`../../assets/countries/countries.${language}.json`);
          expect(json).to.have.property('countries');
          expect(json.countries).to.have.property('DE');
        });
        it('should have the relative sample shout', () => {
          const json = require(`../../assets/samples/shouts.${language}.json`);
          expect(json).to.have.property('shouts');
        });
        it('should have the app store badge file', done => {
          fs.stat(path.resolve(`assets/images/badges/app-store.${language}.png`), err => {
            expect(err).to.be.null;
            done();
          });
        });
        it('should have the play store badge file', done => {
          fs.stat(path.resolve(`assets/images/badges/play-store.${language}.png`), err => {
            expect(err).to.be.null;
            done();
          });
        });
      });

    });
  });
});
