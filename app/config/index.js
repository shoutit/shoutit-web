/* eslint no-console: 0 */

export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development' || !process.env.SHOUTIT_ENV;
export const IS_STAGE = process.env.SHOUTIT_ENV === 'stage';
export const IS_BETA = process.env.SHOUTIT_ENV === 'beta';
export const IS_PRODUCTION = process.env.SHOUTIT_ENV === 'live';

let envConfig = {};
if (IS_DEVELOPMENT) {
  envConfig = require('./development');
} else if (IS_STAGE) {
  envConfig = require('./stage');
} else if (IS_BETA) {
  envConfig = require('./beta');
} else if (IS_PRODUCTION) {
  envConfig = require('./live');
} else {
  throw new Error('SHOUTIT_ENV is not valid.');
}

export const uploadResources = {
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
};

export const apiUrl = envConfig.apiUrl;
export const facebookId = envConfig.facebookId;
export const ga = envConfig.ga;
export const googleMapsKey = 'AIzaSyBTB6-OnMETp1wjS8ZnUugqrlW5UcdEkgc';
export const imagesPath = `${envConfig.publicUrl}/images`;
export const locales = ['en', 'de', 'ar', 'es', 'zh'];
export const publicUrl = envConfig.publicUrl;
export const pusherAppKey = envConfig.pusherAppKey;
export const shoutitEnv = process.env.SHOUTIT_ENV;
export const siteUrl = envConfig.siteUrl;
export const staticResourceUrl = IS_DEVELOPMENT ? `${envConfig.publicUrl}/static_resources` : process.env.AWS_STATIC_ENV;
export const ogPrefix = (IS_STAGE || !process.env.SHOUTIT_ENV) ? 'shoutitcom-dev' : 'shoutitcom';
export const uservoiceApiKey = 'NBlfnPFrkEttGeEqYUhA';
export const mixpanelToken = envConfig.mixpanelToken;

export const appStoreLink = 'https://itunes.apple.com/app/shoutit-app/id947017118';
export const facebookLink = 'https://web.facebook.com/shoutitcom';
export const instagramLink = 'https://www.instagram.com/shoutitcom';
export const playStoreLink = 'https://play.google.com/store/apps/details?id=com.shoutit.app.android';
export const twitterLink = 'https://twitter.com/shoutitcom';

export const androidPackage = envConfig.androidPackage;
export const androidAppName = envConfig.androidAppName;
export const iosAppId = envConfig.iosAppId;
export const iosAppName = envConfig.iosAppName;

export function getSummary() {
  const summary = [];
  summary.push('');
  summary.push('shoutit-web-app');
  summary.push('------------------------------------------------------------');
  summary.push('');
  summary.push(`  Shoutit environment:  ${process.env.SHOUTIT_ENV}`);
  summary.push(`  Node environment:     ${process.env.NODE_ENV}`);
  summary.push(`  Redis host:           ${process.env.REDIS_HOST}`);
  summary.push('');
  summary.push(`  Site URL:             ${siteUrl}`);
  summary.push(`  Public assets URL:    ${publicUrl}`);
  summary.push(`  API URL:              ${apiUrl}`);
  summary.push(`  Images path:          ${imagesPath}`);
  summary.push('');
  summary.push(`  Supported locales:    ${locales.join(', ').toUpperCase()}`);
  summary.push('');
  summary.push(`  New Relic Key:        ${process.env.NEW_RELIC_LICENSE_KEY}`);
  summary.push(`  Google Analytics:     ${ga}`);
  summary.push(`  Facebook ID:          ${facebookId}`);
  summary.push(`  Pusher App Key:       ${pusherAppKey}`);
  summary.push(`  Uservoice API Key:    ${uservoiceApiKey}`);
  summary.push(`  OpenGraph Prefix:     ${ogPrefix}`);
  summary.push(`  Mixpanel Token:       ${mixpanelToken}`);
  summary.push('');
  summary.push(`  iOS app id:           ${iosAppId}`);
  summary.push(`  iOS app name:         ${iosAppName}`);
  summary.push(`  Android package:      ${androidPackage}`);
  summary.push(`  Android app name:     ${androidAppName}`);

  summary.push('');
  return summary.join('\n');
}
