import path from 'path';
import debug from 'debug';

import { getVariable } from './utils';

const log = debug('shoutit:config');

if (!process.env.BROWSER) {
  // Get the configuration variable from the /env directory according to
  // the SHOUTIT_ENV (stage, beta, etc.)
  const filePath = path.resolve(__dirname, `../../env/${process.env.SHOUTIT_ENV || 'development'}`);
  log('Getting env variables from', filePath);
  require('dotenv').config({ path: filePath });
}

export const apiUrl = getVariable('apiUrl');
export const publicUrl = getVariable('publicUrl');
export const imagesPath = `${getVariable('publicUrl')}/images`;
export const siteUrl = getVariable('siteUrl');

export const facebookId = getVariable('facebookId');
export const ogPrefix = getVariable('ogPrefix');
export const ga = getVariable('ga');
export const pusherAppKey = getVariable('pusherAppKey');
export const mixpanelToken = getVariable('mixpanelToken');
export const googleMapsKey = getVariable('googleMapsKey');
export const uservoiceApiKey = getVariable('uservoiceApiKey');

export const androidPackage = getVariable('androidPackage');
export const androidAppName = getVariable('androidAppName');
export const iosAppId = getVariable('iosAppId');
export const iosAppName = getVariable('iosAppName');
export const appProtocol = getVariable('appProtocol');

export const s3Buckets = {
  shout: {
    fieldname: 'shout_image',
    bucket: 'shoutit-shout-image-original',
    cdn: 'https://shout-image.static.shoutit.com',
  },
  user: {
    fieldname: 'user_image',
    bucket: 'shoutit-user-image-original',
    cdn: 'https://user-image.static.shoutit.com',
  },
  tag: {
    fieldname: 'tag_image',
    bucket: 'shoutit-tag-image-original',
    cdn: 'https://tag-image.static.shoutit.com',
  },
  staticPages: {
    bucket: 'shoutit-pages',
    // no need to cdn and fieldname as no uploads are made to this bucket
  },
};

export const locales = [
  'en_US', // first is default
  'ar_AR',
  'cs_CZ',
  'de_DE',
  'es_ES',
  'fr_FR',
  'hi_IN',
  'it_IT',
  'pl_PL',
  'pt_BR',
  'ru_RU',
  'zh_CN',
];

export const appStoreLink =
  'https://itunes.apple.com/app/shoutit-app/id947017118';
export const facebookLink = 'https://web.facebook.com/shoutitcom';
export const instagramLink = 'https://www.instagram.com/shoutitcom';
export const playStoreLink =
  'https://play.google.com/store/apps/details?id=com.shoutit.app.android';
export const twitterLink = 'https://twitter.com/shoutitcom';

export const languages = locales
  .map(locale => locale.split('_')[0])
  .filter((language, index, arr) => arr.indexOf(language) === index);
