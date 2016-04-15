/* eslint no-var: 0, no-console: 0 */
/* eslint-env node */

if (process.env.NODE_ENV === 'production' && process.env.NEW_RELIC_APP_NAME && process.env.NEW_RELIC_LICENSE_KEY) {
  require('newrelic');
}

require('babel-register');

// Prevent issues with libraries using this var (see http://tinyurl.com/pcockwk)
delete process.env.BROWSER;

var config = require('./app/config');

var express = require('express');
var app = express();

if (process.env.NODE_ENV === 'development') {

  var webpack = require('webpack');
  var webpackConfig = require('./webpack.config');
  var webpackCompiler = webpack(webpackConfig);
  var webpackMiddleware = require('webpack-dev-middleware');
  app.use(webpackMiddleware(webpackCompiler, {
    hot: true,
    publicPath: webpackConfig.output.publicPath,
    quiet: false,
    noInfo: false,
    stats: {
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false
    }
  }));

  app.use(require('webpack-hot-middleware')(webpackCompiler));
}

// Start the server
require('./app/server').start(app);

console.log(config.getSummary());

var port = process.env.PORT || '3000';

app.listen(port, function () {
  console.log('\nServer is now listening to %s:%s...', process.env.HOST || 'localhost', port);
});
