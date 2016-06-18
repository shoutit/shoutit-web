/* eslint no-console: 0, vars-on-top: 0 */
import express from 'express';
import { getSummary } from './app/config';
import { start } from './app/server';
import './app/server/intl-polyfill';

const port = process.env.PORT || 3000;
const app = express();

console.log(getSummary());

if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack');
  const webpackConfig = require('./webpack.config');
  const webpackCompiler = webpack(webpackConfig);
  const webpackMiddleware = require('webpack-dev-middleware');
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

start(app);
app.listen(port, () =>
  console.log('\nServer is now listening to %s:%s...', process.env.HOST || 'localhost', port)
);
