/* eslint-env node */

if (process.env.NODE_ENV === 'production' &&
  process.env.NEW_RELIC_APP_NAME &&
  process.env.NEW_RELIC_LICENSE_KEY) {
  require('newrelic');
}

require('ignore-styles');
require('./app.js');
