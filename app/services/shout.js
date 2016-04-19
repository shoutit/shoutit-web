import last from 'lodash/array/last';

import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';
import * as AWS from '../utils/AWS';
import { uploadResources } from '../config';

export default {
  name: 'shout',
  create: (req, resource, params, shout, config, callback) => {
    request
      .post('/shouts')
      .prefix()
      .setSession(req.session)
      .send(shout)
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback(null, res.body);
      });
  },
  read: (req, resource, params, config, callback) => {
    request
      .get(`/shouts/${params.id}`)
      .setSession(req.session)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err, { resource, params, url: req.url }));
        }
        return callback(null, res.body);
      });
  },
  update: (req, resource, { id }, shout, config, callback) => {
    request
      .patch(`/shouts/${id}`)
      .prefix()
      .setSession(req.session)
      .send(shout)
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback(null, res.body);
      });

    if (shout.removedImages) {
      const { bucket } = uploadResources.shout;
      AWS.del({ keys: shout.removedImages, bucket });
    }
  },
  delete: (req, resource, { shout }, config, callback) => {
    request
      .delete(`/shouts/${shout.id}`)
      .prefix()
      .setSession(req.session)
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback(null, res.body);
      });

    if (shout.images && shout.images.length > 0) {
      const { bucket } = uploadResources.shout;
      AWS.del({ keys: shout.images.map(url => last(url.split('/'))), bucket });
    }

  },
};
