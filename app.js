/* eslint no-var: 0, no-console: 0 */
/* eslint-env node */

if (process.env.NODE_ENV === "production") {
  require("newrelic");
}

require("babel/register");

// Prevent issues with libraries using this var (see http://tinyurl.com/pcockwk)
delete process.env.BROWSER;

var debug = require("debug");
var log = debug("shoutit:server");
var error = debug("shoutit:error");

var config = require("./config");

var express = require("express");
var app = express();

if (process.env.NODE_ENV === "development") {

  var webpack = require("webpack");
  var webpackConfig = require("./webpack.config");
  var webpackCompiler = webpack(webpackConfig);
  var webpackMiddleware = require("webpack-dev-middleware");
  app.use(webpackMiddleware(webpackCompiler, {
    hot: true,
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true
    }
  }));

  app.use(require("webpack-hot-middleware")(webpackCompiler));
}

// Start the server
require("./app/server/web.js")(app);

// Startup

config.reportWarnings().forEach(function(msg) {
  console.log(`${msg}`);
  error(msg);
});

log("Node environment is '%s'", process.env.NODE_ENV);
log("Shoutit environment is '%s'", config.shoutitEnv, config.baseUrl);
log("Base URL is '%s'", config.baseUrl);
log("API URL is '%s'", config.apiUrl);


app.listen(config.port, config.host, function () {
  log("Server is now listening to %s:%s...", config.host, config.port);
});
