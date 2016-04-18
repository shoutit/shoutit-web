/* eslint-env node */

if (process.env.NODE_ENV === 'production' &&
  process.env.NEW_RELIC_APP_NAME &&
  process.env.NEW_RELIC_LICENSE_KEY) {
  require('newrelic');
}

if (process.env.NODE_ENV === 'production') {
  require('babel-register');
}

// Prevent issues with libraries using this var (see http://tinyurl.com/pcockwk)
delete process.env.BROWSER;
require('./app.js');
