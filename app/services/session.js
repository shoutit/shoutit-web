import { camelizeKeys } from 'humps';
import merge from 'lodash/merge';
import debug from 'debug';

import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

import {
  AUTH_CLIENT_ID as client_id,
  AUTH_CLIENT_SECRET as client_secret,
} from './constants';

const log = debug('shoutit:services:session');

export function loadProfile(req, callback) {
  request
    .get('/profiles/me')
    .use(req)
    .prefix()
    .end((err, res) => {
      if (err) {
        console.error(err);
        req.session.destroy();
        callback();
      }
      const profile = camelizeKeys(res.body);
      log('Current profile\'s username is %s', profile.username);
      callback(profile);
    });
}

export function loadAuthorizationPage(req, callback) {
  request
    .get(`/profiles/${req.session.authorizationPage.username}`)
    .use(req)
    .prefix()
    .end((err, res) => {
      if (err) {
        console.error(err);
        callback();
      }
      const page = camelizeKeys(res.body);
      callback(page);
    });
}


export default {
  name: 'session',

  create: (req, resource, params, body, config, callback) => {
    const data = merge(body, {
      profile: {
        location: req.session.currentLocation || {},
      },
      client_id,
      client_secret,
    });
    log('Creating request session...', data);
    request
      .post('/oauth2/access_token')
      .send(data)
      .use(req)
      .prefix()
      .end((err, res) => {

        if (err) {
          callback(parseApiError(err));
          return;
        }

        const account = camelizeKeys(res.body);
        Object.assign(req.session, account);
        req.session.cookie.expires = new Date(Date.now() + (account.expiresIn * 1000));

        log('Request session has been created and will expires on %s', req.session.cookie.expires);
        callback(null, account.profile);
      });
  },

  read: (req, resource, params, config, callback) => {
    log('Reading current session...', req.session);
    loadProfile(req, profile => {
      req.session.profile = profile;

      if (!req.session.authorizationPage) {
        return callback(null, profile);
      }

      return loadAuthorizationPage(req, page => {
        if (page) {
          if (page.isOwner) {
            req.session.page = page;
            log('Session authorization page set as %s', page.username);
          } else {
            log('Logged profile %s is not owner of the authorization page %s', profile.username, page.username);
          }
        }
        callback(null, profile);
      });

    });
  },

  delete: (req, resource, params, config, callback) => {
    req.session.destroy(callback);
  },

};
