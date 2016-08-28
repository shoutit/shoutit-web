import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';
import { shoutit_signup } from '../constants/grantTypes';

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

    const data = {
      grant_type: shoutit_signup,
      name: `${body.firstName} ${body.lastName}`,
      email: body.email,
      password: body.password,
      profile: {
        location: req.session.location,
        language: req.session.language,
      },
      mixpanel_distinct_id: body.mixpanel_distinct_id,
    };

    req.fetchr.create('session')
      .body(data)
      .end(callback);

  },
  read: (req, resource, params, config, callback) => {
    request
      .get(`/profiles/${params.username}`)
      .use(req)
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
      .use(req)
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
