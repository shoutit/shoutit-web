/* eslint no-var: 0, no-console: 0 */
/* eslint-env node */

if (process.env.NODE_ENV === "production") {
  require("newrelic")
}

require("babel/register")

var express = require("express")
var app = express()

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
  }))

  app.use(require("webpack-hot-middleware")(webpackCompiler))
}

// Start the server
require("./app/server/web.js")(app)

// startup
var port = process.env.PORT || process.env.NODE_ENV === "development" ? 3000 : 8080
app.listen(port, function () {
  console.log("Listening at http://localhost:" + port)
})
