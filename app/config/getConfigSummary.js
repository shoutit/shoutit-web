import * as config from './index';

/**
 * Return a string containing the config summary
 *
 * @export
 * @returns
 */
export default function getConfigSummary() {
  const summary = [];
  summary.push('');
  summary.push('shoutit-web-app');
  summary.push('------------------------------------------------------------');
  summary.push('');
  summary.push(`  Shoutit environment:  ${process.env.SHOUTIT_ENV}`);
  summary.push(`  Node environment:     ${process.env.NODE_ENV}`);
  summary.push(`  Redis host:           ${process.env.REDIS_HOST}`);
  summary.push('');
  summary.push(`  Site URL:             ${config.SITE_URL}`);
  summary.push(`  Public assets URL:    ${config.PUBLIC_URL}`);
  summary.push(`  API URL:              ${config.API_URL}`);
  summary.push(`  Images path:          ${config.IMAGES_PATH}`);
  summary.push('');
  summary.push(`  Supported locales:    ${config.LOCALES.join(', ')}`);
  summary.push(`  Supported languages:  ${config.LANGUAGES.join(', ')}`);
  summary.push('');
  summary.push(`  Sentry DSN:           ${process.env.SENTRY_DSN}`);
  summary.push(`  New Relic Key:        ${process.env.NEW_RELIC_LICENSE_KEY}`);
  summary.push(`  Google Analytics:     ${config.GA}`);
  summary.push(`  Facebook ID:          ${config.FACEBOOK_ID}`);
  summary.push(`  Pusher App Key:       ${config.PUSHER_APP_KEY}`);
  summary.push(`  Uservoice API Key:    ${config.USERVOICE_API_KEY}`);
  summary.push(`  OpenGraph Prefix:     ${config.OG_PREFIX}`);
  summary.push(`  Mixpanel Token:       ${config.MIXPANEL_TOKEN}`);
  summary.push('');
  summary.push(`  iOS app id:           ${config.IOS_APP_ID}`);
  summary.push(`  iOS app name:         ${config.IOS_APP_NAME}`);
  summary.push(`  Android package:      ${config.ANDROID_PACKAGE}`);
  summary.push(`  Android app name:     ${config.ANDROID_APP_NAME}`);
  summary.push(`  App protocol:         ${config.APP_PROTOCOL}`);

  summary.push('');
  return summary.join('\n');
}
