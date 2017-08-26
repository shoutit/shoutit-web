import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import * as config from '../config';

const expectedVars = [
  'ANDROID_APP_NAME',
  'ANDROID_PACKAGE',
  'API_URL',
  'APP_PROTOCOL',
  'APP_STORE_LINK',
  'CURRENT_TAG',
  'FACEBOOK_ID',
  'FACEBOOK_LINK',
  'GA',
  'GOOGLE_MAPS_KEY',
  'IMAGES_PATH',
  'INSTAGRAM_LINK',
  'IOS_APP_ID',
  'IOS_APP_NAME',
  'LANGUAGES',
  'LOCALES',
  'MIXPANEL_TOKEN',
  'OG_PREFIX',
  'PLAYSTORE_LINK',
  'PUBLIC_URL',
  'PUSHER_APP_KEY',
  'S3_BUCKETS',
  'SITE_URL',
  'TWITTER_LINK',
  'USERVOICE_API_KEY',
];

describe('config', () => {
  it('should export all the config', () => {
    expect(Object.keys(config)).to.have.length(expectedVars.length);

    expectedVars.map(key =>
      expect(Object.keys(config).indexOf(key), `${key} config was not found!`).to.be.greaterThan(-1)
    );

  });

  describe('config.LOCALES', () => {
    it('should have en_US as default locale', () => {
      expect(config.LOCALES[0]).to.equal('en_US');
    });
  });
  describe('config.LANGUAGES', () => {
    it('should have en as default locale', () => {
      expect(config.LANGUAGES[0]).to.equal('en');
    });
    config.LANGUAGES.forEach(language => {
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
