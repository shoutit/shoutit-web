import { camelizeKeys } from 'humps';
import debug from 'debug';

import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

import {
  AUTH_CLIENT_ID as client_id,
  AUTH_CLIENT_SECRET as client_secret,
} from './constants';

const log = debug('shoutit:services:session');

export function readSessionProfile(req) {
  log('Reading the current session\'s profile...');
  return new Promise(resolve => {
    request
      .get('/profiles/me')
      .use(req)
      .prefix()
      .end((err, res) => {
        if (err) {
          console.warn('Trying to get user %s but got an error with status code %s: destroying current session...', req.session.user.username, res && res.status); //eslint-disable-line
          console.error(err); //eslint-disable-line
          req.session.destroy();
          resolve();
        }
        const profile = camelizeKeys(res.body);
        log('Current profile\'s username is %s', profile.username);
        resolve(profile);
      });
  });
}

export function readAuthenticatedPage(req) {
  if (!req.session || !req.session.authorizationPage) {
    return Promise.resolve();
  }
  log('Reading the current authenticated page...');
  const { authorizationPage } = req.session;
  return new Promise(resolve => {
    request
      .get(`/profiles/${authorizationPage.username}`)
      .use(req)
      .prefix()
      .end((err, res) => {
        if (err) {
          console.error(err);
          resolve();
        }
        const page = camelizeKeys(res.body);
        resolve(page);
      });
  });
}


export default {
  name: 'session',

  create: (req, resource, params, body, config, callback) => {
    log('Creating request session...');
    request
      .post('/oauth2/access_token')
      .send({ ...body, client_id, client_secret })
      .use(req)
      .prefix()
      .end((err, res) => {
        if (err) {
          callback(parseApiError(err));
          return;
        }

        const response = camelizeKeys(res.body);
        const { accessToken, refreshToken, newSignup, expiresIn, scope, profile } = response;

        req.session.user = profile;
        req.session.newSignup = newSignup;
        req.session.accessToken = accessToken;
        req.session.refreshToken = refreshToken;
        req.session.cookie.expires = new Date(Date.now() + (expiresIn * 1000));
        req.session.scope = scope ? scope.split[' '] : [];

        log('Request session has been created and will expires on %s', req.session.cookie.expires);

        callback(null, profile);
      });
  },

  read: (req, resource, params, config, callback) => {
    log('Reading current session...', req.session);
    if (!req.session || !req.session.user) {
      callback(new Error('Session does not exists'));
      return;
    }

    readSessionProfile(req)
      .then(profile =>
        req.session.user = profile
      )
      .then(() =>
        readAuthenticatedPage(req)
      )
      .then(page => {
        if (!page.isOwner) {
          log('Not owner of %s, removing authorizationPage from session', page.username);
          delete req.session.authorizationPage;
          return;
        }
        log('Authenticated page\'s username is %s', page.username);
        req.session.page = page;
      })
      .then(() =>
        callback(req.session.profile)
      );
  },

  delete: (req, resource, params, config, callback) => {
    req.session.destroy(callback);
  },

};
