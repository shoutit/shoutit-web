import { getVariable } from './utils';

if (!process.env.BROWSER) {
  const path = require('path');
  const fs = require('fs');
  // Get the configuration variable from the /env directory according to
  // the SHOUTIT_ENV (stage, beta, etc.)
  const shoutitEnv = (process.env.SHOUTIT_ENV || 'development').toLowerCase();
  const filePath = path.resolve(__dirname, `../../env/${shoutitEnv}.env`);
  if (!fs.existsSync(filePath)) {
    console.warn(`Couldn\'t find ${filePath}`);
  }
  require('dotenv').config({ path: filePath });
}

export const CURRENT_TAG = getVariable('CURRENT_TAG');

export const API_URL = getVariable('API_URL');
export const SITE_URL = getVariable('SITE_URL');

let publicUrl = getVariable('PUBLIC_URL');
const taggedPublicUrl = getVariable('TAGGED_PUBLIC_URL');
if (['', '/no-git-info/'].indexOf(CURRENT_TAG) === -1 && !!taggedPublicUrl) {
  publicUrl = `${taggedPublicUrl}/${CURRENT_TAG}`;
}
export const PUBLIC_URL = publicUrl;
export const IMAGES_PATH = `${getVariable('PUBLIC_URL')}/images`;

export const FACEBOOK_ID = getVariable('FACEBOOK_ID');
export const OG_PREFIX = getVariable('OG_PREFIX');
export const GA = getVariable('ga');
export const PUSHER_APP_KEY = getVariable('PUSHER_APP_KEY');
export const MIXPANEL_TOKEN = getVariable('MIXPANEL_TOKEN');
export const GOOGLE_MAPS_KEY = getVariable('GOOGLE_MAPS_KEY');
export const USERVOICE_API_KEY = getVariable('USERVOICE_API_KEY');

export const ANDROID_PACKAGE = getVariable('ANDROID_PACKAGE');
export const ANDROID_APP_NAME = getVariable('ANDROID_APP_NAME');
export const IOS_APP_ID = getVariable('IOS_APP_ID');
export const IOS_APP_NAME = getVariable('IOS_APP_NAME');
export const APP_PROTOCOL = getVariable('APP_PROTOCOL');

export const S3_BUCKETS = {
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

export const APP_STORE_LINK =
  'https://itunes.apple.com/app/shoutit-app/id947017118';
export const FACEBOOK_LINK = 'https://web.facebook.com/shoutitcom';
export const INSTAGRAM_LINK = 'https://www.instagram.com/shoutitcom';
export const PLAYSTORE_LINK =
  'https://play.google.com/store/apps/details?id=com.shoutit.app.android';
export const TWITTER_LINK = 'https://twitter.com/shoutitcom';


export const LOCALES = [
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

export const LANGUAGES = LOCALES
  .map(locale => locale.split('_')[0])
  .filter((language, index, arr) => arr.indexOf(language) === index);
