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
    if (!body.firstName) {
      const firstNameError = new Error('first_name');
      firstNameError.errors = [{
        location: 'first_name',
        message: 'Enter your first name',
      }];
      callback(firstNameError);
      return;
    }

    if (!body.lastName) {
      const lastNameError = new Error('Last name is required');
      lastNameError.errors = [{
        location: 'last_name',
        message: 'Enter your last name',
      }];
      callback(lastNameError);
      return;
    }

    let location = {};
    if (body.location && body.location.latitude && body.location.longitude) {
      location = {
        latitude: body.location.latitude,
        longitude: body.location.longitude,
      };
    }
    const data = {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'shoutit_signup',
      name: `${body.firstName} ${body.lastName}`,
      email: body.email,
      password: body.password,
      profile: { location },
      mixpanel_distinct_id: body.mixpanel_distinct_id,
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
  read: (req, resource, params, config, callback) => {
    request
      .get(`/profiles/${params.username}`)
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
    if (body.location) {
      delete body.location.city;
      delete body.location.state;
      delete body.location.country;
    }
    request
      .patch('/profiles/me')
      .send(body)
      .setSession(req.session)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        req.session.user = res.body;
        return callback(null, res.body);
      });
  },
};
