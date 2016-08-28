import session from 'express-session';
import connectRedis from 'connect-redis';
import debug from 'debug';
import * as grantTypes from '../constants/grantTypes';

import newrelic, { newrelicEnabled } from '../server/newrelic';
import { removeParamsFromUrl } from '../utils/StringUtils';

const log = debug('shoutit:server:sessionMiddleware');

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

/**
 * Check req.session has been set
 *
 * @export
 * @param {any} req
 * @param {any} res
 * @param {any} next
 * @returns
 */
export function checkExistingSession(req, res, next) {
  if (!req.session) {
    const error = new Error('Cannot initialize session');
    if (newrelicEnabled) {
      newrelic.noticeError('CONN:REDIS FAILED', error);
    }
    console.error('Error connecting to redis, was trying %s:%s', storeSettings.host, storeSettings.host);
    next(error);
  }
  return next();
}

/**
 * Login via auth_token from req.query
 */
export function authTokenLogin(req, res, next) {
  if (!req.query.hasOwnProperty('auth_token')) {
    return next();
  }
  if (!req.fetchr) {
    throw new Error('Fetchr not initialized');
  }
  log('Trying to login via auth_token %s...', req.query.auth_token);
  return req.fetchr.create('session')
    .body({
      auth_token: req.query.auth_token,
      grant_type: grantTypes.auth_token,
    })
    .end((err, user) => {
      const toUrl = removeParamsFromUrl(req.url, 'auth_token');
      if (!err) {
        log('User %s has been logged in via auth_token', user.username);
        req.session.save(() => res.redirect(toUrl));
        return;
      }
      res.redirect(toUrl);
    });
}

export function logoutMiddleware(req, res) {
  req.fetchr.delete('session').end(res.redirect('/'));
}

/**
 * Apply the middlewares for an express app to handle user's sessions
 * and the logged user.
 *
 * @export
 * @param {Object} app
 */
const maxAge = 365 * 24 * 60 * 60 * 1000;
export default function (app) {
  const cookie = { maxAge };
  if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    cookie.secure = true; // serve secure cookies
  }
  app.use(session({
    secret: 'ShoutItOutLoudIntoTheCrowd',
    cookie,
    name: 'shoutit.sid',
    resave: true,
    saveUninitialized: true,
    maxAge,
    store: new RedisStore(storeSettings),
  }));
  app.use(checkExistingSession);
  app.use(authTokenLogin);

  app.get('/logout', logoutMiddleware);
}
