require('babel/register');

var express = require('express');
var app = express();

var webpackMiddleware = require('webpack-dev-middleware');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.dev');
var webpackCompiler = webpack(webpackConfig);

app.use(webpackMiddleware(webpackCompiler, {
  hot: true,
  // inline: true,
  // lazy: false,
  // quiet: true,
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true
  }
}))
app.use(require('webpack-hot-middleware')(webpackCompiler));

require('./app/server/web.js')(app);

// startup
var port = process.env.port || 8080;
app.listen(port, function () {
	console.log('Listening at http://localhost:' + port);
});
