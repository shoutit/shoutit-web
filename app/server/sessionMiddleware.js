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
const regExp = /\w*:\/\/(\w*):(\d*)/;
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
  ...getHostAndPort(process.env.REDIS_ADDRESS),
  db: 11,
  port: 6379,
  logErrors: error => {
    newrelicEnabled && newrelic.noticeError('CONN:REDIS FAILED', error);
    console.error(error);
  },
};

export default session({
  store: new RedisStore(storeSettings),
  secret: 'ShoutItOutLoudIntoTheCrowd',
  resave: false,
  saveUninitialized: true,
});
