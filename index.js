/* eslint no-var: 0, no-console: 0 */
/* eslint-env node */

var fs = require('fs');
var path = require('path');

if (process.env.NODE_ENV === 'production' &&
  process.env.NEW_RELIC_APP_NAME &&
  process.env.NEW_RELIC_LICENSE_KEY) {
  require('newrelic');
}

if (!process.env.CURRENT_TAG) {
  try {
    let currentTag = fs.readFileSync(path.resolve(__dirname, './CURRENT_TAG'), 'utf8');
    currentTag = currentTag.replace(/[\n\r]/gi, '');
    process.env.CURRENT_TAG = currentTag;
  } catch (e) {
    console.error(e);
  }
}

require('ignore-styles');
require('./app.js');
