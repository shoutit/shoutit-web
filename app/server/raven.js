/* eslint-disable import/no-mutable-exports */
export const ravenEnabled = !!process.env.SENTRY_DSN;
let Raven;
if (ravenEnabled) {
  Raven = require('raven');

  Raven.config(process.env.SENTRY_DSN, {
    autoBreadcrumbs: true,
    environment: process.env.SHOUTIT_ENV,
    parseUser: ['id', 'username', 'email'],
    release: process.env.CURRENT_TAG,
    sendTimeout: 5,
  }).install();
}
export default Raven;
