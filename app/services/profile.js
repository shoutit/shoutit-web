import { camelizeKeys } from 'humps';
import request from '../utils/request';
import { setRequestSession } from '../services/session';
import { parseApiError } from '../utils/APIUtils';

import {
  AUTH_CLIENT_ID as clientId,
  AUTH_CLIENT_SECRET as clientSecret,
} from './constants';

export default {
  name: 'profile',
  create: (req, resource, params, body, config, callback) => {
    const { firstName, lastName, email, password, location } = body;

    if (!firstName) {
      const firstNameError = new Error('First name is required');
      firstNameError.errors = [{
        location: 'first_name',
        message: 'Enter your first name',
      }];
      callback(firstNameError);
      return;
    }

    if (!lastName) {
      const lastNameError = new Error('Last name is required');
      lastNameError.errors = [{
        location: 'last_name',
        message: 'Enter your last name',
      }];
      callback(lastNameError);
      return;
    }

    const name = `${firstName} ${lastName}`;
    const data = {
      name, email, password, profile: { location },
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'shoutit_signup',
    };
    request
      .post('/oauth2/access_token')
      .send(data)
      .setSession(req.session)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        setRequestSession(req, camelizeKeys(res.body));
        return callback(null, req.session.user);
      });
  },
  read: (req, resource, { username }, config, callback) => {
    request
      .get(`/profiles/${username}`)
      .setSession(req.session)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback(null, res.body);
      });
  },
  update: (req, resource, params, body, config, callback) => {
    request
      .patch('/profiles/me')
      .send(body)
      .setSession(req.session)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        req.session.user = res.body; // eslint-disable-line
        return callback(null, res.body);
      });
  },
};
