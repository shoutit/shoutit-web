import request from '../utils/request';
import { createRequestSession } from '../utils/SessionUtils';
import { parseErrorResponse } from '../utils/APIUtils';
import { camelizeKeys } from 'humps';

import {
  AUTH_CLIENT_ID as clientId,
  AUTH_CLIENT_SECRET as clientSecret
} from './constants';


export default {
  name: 'session',
  create: (req, resource, params, body, config, callback) => {
    const data = { ...body, client_id: clientId, client_secret: clientSecret };
    request
      .post('/oauth2/access_token')
      .send(data)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseErrorResponse(err));
        }
        createRequestSession(req, res.body);
        return callback(null, res.body.user);
      });
  },
  read: (req, resource, params, config, callback) => {
    if (!req.session || !req.session.user) {
      callback();
      return;
    }
    request
      .get('/profiles/me')
      .setSession(req.session)
      .prefix()
      .end((err, res) => {
        if (err) {
          console.warn('Trying to get user %s but got an error with status code %s: destroying current session...', req.session.user.username, res && res.status); //eslint-disable-line
          console.error(err); //eslint-disable-line
          req.session.destroy();
          return callback();
        }
        req.session.user = camelizeKeys(res.body);
        return callback(null, res.body);
      });
  },

  delete: (req, resource, params, config, callback) => {
    req.session.destroy(callback);
  },

};
