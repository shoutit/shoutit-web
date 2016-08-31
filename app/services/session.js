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
  let username = 'me';
  if (req.session.profile) {
    username = req.session.profile.username;
  }
  request
    .get(`/profiles/${username}`)
    .use(req)
    .prefix()
    .camelizeResponseBody()
    .end((err, res) => {
      if (err) {
        console.error(err);
        callback(err);
      }
      callback(null, res.body);
    });
}

export function loadAuthorizationPage(req, callback) {
  request
    .get(`/profiles/${req.session.page.username}`)
    .use(req)
    .prefix()
    .camelizeResponseBody()
    .end((err, res) => {
      if (err) {
        console.error(err);
        callback(err);
      }
      callback(null, res.body);
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
      .camelizeResponseBody()
      .end((err, res) => {

        if (err) {
          callback(parseApiError(err));
          return;
        }

        const account = res.body;
        Object.assign(req.session, account);
        req.session.cookie.expires = new Date(Date.now() + (account.expiresIn * 1000));

        log('Request session has been created and will expires on %s', req.session.cookie.expires);
        callback(null, account.profile);
      });
  },

  read: (req, resource, params, config, callback) => {
    log('Updating current session...', req.session);
    loadProfile(req, (err, profile) => {
      if (err) {
        log('Error fetching session data, destroying session...', req.session);
        req.session.destroy();
        return callback();
      }
      req.session.profile = profile;
      log('Current session username is %s', req.session.profile.username);

      if (!req.session.page) {
        log('%s is not authenticated as page', req.session.profile.username);
        return callback(null, profile);
      }

      log('Updating current authorized page...', req.session);
      return loadAuthorizationPage(req, (err, page) => {
        if (err) {
          log('Error fetching page data, removing it from session...', req.session);
          delete req.session.page;
        } else if (page.isOwner) {
          req.session.page = page;
          log('Session authorization page set as %s', page.username);
        } else {
          log('Logged profile %s is not owner of page %s, deleting it from session', profile.username, page.username);
          delete req.session.page;
        }
        callback(null, profile);
      });

    });
  },

  delete: (req, resource, params, config, callback) => {
    req.session.destroy(callback);
  },

};
