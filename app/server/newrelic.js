/* eslint-disable import/no-mutable-exports */
export const newrelicEnabled = !!process.env.NEW_RELIC_APP_NAME;
let newrelic;
if (newrelicEnabled) {
  newrelic = require('newrelic');
}
export default newrelic;
