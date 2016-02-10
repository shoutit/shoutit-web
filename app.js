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


const summary = [];
summary.push("");
summary.push("  shoutit-web-app config");
summary.push("  ------------------------------------------------------------");
summary.push();
summary.push("  Node environment:     " + process.env.NODE_ENV);
summary.push("  Shoutit environment:  " + config.shoutitEnv);
summary.push("  Base URL:             " + config.baseUrl);
summary.push("  API URL:              " + config.apiUrl);
summary.push("  Redis host:           " + config.redisHost);
summary.push("");

console.log(summary.join("\n"));

config.reportWarnings().forEach(function(msg) {
  error(msg);
});

app.listen(config.port, function () {
  console.log();
  log("Server is now listening to %s...", config.port);
});
