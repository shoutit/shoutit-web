/* eslint no-console: 0, vars-on-top: 0 */
import express from 'express';
import getConfigSummary from './app/config/getConfigSummary';
import startServer from './app/server';
import './app/server/intl-polyfill';

const port = process.env.PORT || 3000;
const app = express();

console.log(getConfigSummary());

if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack');
  const webpackConfig = require('./webpack.config');
  const webpackMiddleware = require('webpack-dev-middleware');

  const webpackCompiler = webpack(webpackConfig);

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
      chunkModules: false,
    },
  }));

  app.use(require('webpack-hot-middleware')(webpackCompiler));
}

startServer(app);
app.listen(port, () =>
  console.log('\nServer is now listening to %s:%s...', process.env.HOST || 'localhost', port)
);
