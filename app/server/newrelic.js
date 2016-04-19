let newrelic;
export const newrelicEnabled = !!process.env.NEW_RELIC_APP_NAME;
if (newrelicEnabled) {
  newrelic = require('newrelic');
}
export default newrelic;
