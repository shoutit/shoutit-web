import { camelizeKeys } from 'humps';
import debug from 'debug';

import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

import {
  AUTH_CLIENT_ID as client_id,
  AUTH_CLIENT_SECRET as client_secret,
} from './constants';

const log = debug('shoutit:service:session');

export function setRequestSession(req, sessionData) {
  const { profile, accessToken, refreshToken, scope, expiresIn } = sessionData;
  req.session.user = profile;
  req.session.accessToken = accessToken;
  req.session.refreshToken = refreshToken;
  req.session.cookie.expires = new Date(Date.now() + (expiresIn * 1000));
  req.session.scope = scope ? scope.split[' '] : [];
  log('Request session has been created and will expires on %s', req.session.cookie.expires);
}

export function createRequestSession(req, data, callback) {
  if (!req.session) {
    const error = new Error('Cannot initialize session');
    callback(error);
    return;
  }
  log('Creating request session...');
  request
    .post('/oauth2/access_token')
    .send({ ...data, client_id, client_secret })
    .use(req)
    .prefix()
    .end((err, res) => {
      if (err) {
        callback(parseApiError(err));
        return;
      }
      setRequestSession(req, camelizeKeys(res.body));
      callback(null, req.session.user);
    });
}

export function readSessionProfile(req, callback) {
  log('Reading the current session\'s profile...');
  request
    .get('/profiles/me')
    .use(req)
    .prefix()
    .end((err, res) => {
      if (err) {
        console.warn('Trying to get user %s but got an error with status code %s: destroying current session...', req.session.user.username, res && res.status); //eslint-disable-line
        console.error(err); //eslint-disable-line
        req.session.destroy();
        return callback();
      }
      log('Current profile\'s username is %s', res.body.username);
      const user = camelizeKeys(res.body);
      return callback(null, user);
    });
}

export default {
  name: 'session',
  create: (req, resource, params, body, config, callback) => {
    createRequestSession(req, body, callback);
  },
  read: (req, resource, params, config, callback) => {
    log('Reading current session...');
    if (!req.session || !req.session.user) {
      callback(new Error('Session does not exists'));
      return;
    }
    readSessionProfile(req, callback);
  },
  delete: (req, resource, params, config, callback) => {
    req.session.destroy(callback);
  },
};
