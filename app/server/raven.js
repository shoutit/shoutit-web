/* eslint-disable import/no-mutable-exports */
export const ravenEnabled = !!process.env.SENTRY_DSN;
let Raven;
if (ravenEnabled) {
  Raven = require('raven');

  Raven.config(process.env.SENTRY_DSN).install();
}
export default Raven;
