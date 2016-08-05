/* eslint no-console: 0 */

import session from 'express-session';
import connectRedis from 'connect-redis';
import newrelic, { newrelicEnabled } from '../server/newrelic';

/**
 * Get a { host, port } object from an address, e.g.
 * tcp://foo:123 will return { host: 'foo', port: 123 }
 *
 * @export
 * @param {any} address
 * @returns
 */
const regExp = /\w*:\/\/([\w\d\.]*):(\d*)/;
export function getHostAndPort(address) {
  // Default values for redis
  let host = 'localhost';
  let port = 6379;

  if (address) {
    const matches = address.match(regExp);
    if (matches) {
      host = matches[1];
      port = +matches[2];
    }
  }
  return { host, port };
}

const RedisStore = connectRedis(session);
const storeSettings = {
  ...getHostAndPort(process.env.REDIS_PORT),
  db: 11,
};

const sessionOptions = {
  secret: 'ShoutItOutLoudIntoTheCrowd',
  resave: false,
  saveUninitialized: true,
};

export default function (app) {
  app.use(session({
    ...sessionOptions,
    store: new RedisStore(storeSettings),
  }));
  app.use((req, res, next) => {
    if (!req.session) {
      if (newrelicEnabled) {
        newrelic.noticeError('CONN:REDIS FAILED', new Error('Cannot initialize session'));
      }
      console.error('Error connecting to redis, trying to connect to %s:%s', storeSettings.host, storeSettings.host);
    }
    return next();
  });
}
