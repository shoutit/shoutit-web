import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import * as config from '../config';

const expectedVars = [
  'androidAppName',
  'androidPackage',
  'apiUrl',
  'appProtocol',
  'appStoreLink',
  'facebookId',
  'facebookLink',
  'ga',
  'googleMapsKey',
  'imagesPath',
  'instagramLink',
  'iosAppId',
  'iosAppName',
  'languages',
  'locales',
  'mixpanelToken',
  'ogPrefix',
  'playStoreLink',
  'publicUrl',
  'pusherAppKey',
  's3Buckets',
  'siteUrl',
  'twitterLink',
  'uservoiceApiKey',
];

describe('config', () => {
  it('should export all the config', () => {
    expect(Object.keys(config)).to.have.length(expectedVars.length);

    Object.keys(config).map(key =>
      expect(expectedVars.indexOf(key)).to.be.greaterThan(-1)
    );

  });

  describe('config.locales', () => {
    it('should have en_US as default locale', () => {
      expect(config.locales[0]).to.equal('en_US');
    });
  });
  describe('config.languages', () => {
    it('should have en as default locale', () => {
      expect(config.languages[0]).to.equal('en');
    });
    config.languages.forEach(language => {
      describe(language, () => {
        it('should have the translation file', done => {
          fs.stat(
            path.resolve(`assets/intl/translations/${language}.json`),
            err => {
              expect(err).to.be.null;
              done();
            }
          );
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
          fs.stat(
            path.resolve(`assets/images/badges/app-store.${language}.png`),
            err => {
              expect(err).to.be.null;
              done();
            }
          );
        });
        it('should have the play store badge file', done => {
          fs.stat(
            path.resolve(`assets/images/badges/play-store.${language}.png`),
            err => {
              expect(err).to.be.null;
              done();
            }
          );
        });
      });
    });
  });
});
