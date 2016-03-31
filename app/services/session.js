import request from '../utils/request';
import { createRequestSession } from '../utils/SessionUtils';
import { parseErrorResponse } from '../utils/APIUtils';

import {
  AUTH_CLIENT_ID as client_id,
  AUTH_CLIENT_SECRET as client_secret
} from './constants';


export default {
  name: 'session',
  create: (req, resource, params, body, config, callback) => {
    const data = { ...body, client_id, client_secret };
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
      .get(`/profiles/${req.session.user.username}`)
      .setSession(req.session)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseErrorResponse(err));
        }
        return callback(null, res.body);
      });
  },

  delete: (req, resource, params, config, callback) => {
    req.session.destroy(callback);
  },

};
