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
  summary.push(`  Site URL:             ${config.siteUrl}`);
  summary.push(`  Public assets URL:    ${config.publicUrl}`);
  summary.push(`  API URL:              ${config.apiUrl}`);
  summary.push(`  Images path:          ${config.imagesPath}`);
  summary.push('');
  summary.push(`  Supported locales:    ${config.locales.join(', ')}`);
  summary.push(`  Supported languages:  ${config.languages.join(', ')}`);
  summary.push('');
  summary.push(`  Sentry DSN:           ${process.env.SENTRY_DSN}`);
  summary.push(`  New Relic Key:        ${process.env.NEW_RELIC_LICENSE_KEY}`);
  summary.push(`  Google Analytics:     ${config.ga}`);
  summary.push(`  Facebook ID:          ${config.facebookId}`);
  summary.push(`  Pusher App Key:       ${config.pusherAppKey}`);
  summary.push(`  Uservoice API Key:    ${config.uservoiceApiKey}`);
  summary.push(`  OpenGraph Prefix:     ${config.ogPrefix}`);
  summary.push(`  Mixpanel Token:       ${config.mixpanelToken}`);
  summary.push('');
  summary.push(`  iOS app id:           ${config.iosAppId}`);
  summary.push(`  iOS app name:         ${config.iosAppName}`);
  summary.push(`  Android package:      ${config.androidPackage}`);
  summary.push(`  Android app name:     ${config.androidAppName}`);
  summary.push(`  App protocol:         ${config.appProtocol}`);

  summary.push('');
  return summary.join('\n');
}
