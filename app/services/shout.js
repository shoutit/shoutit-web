
import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';
import * as AWS from '../utils/AWS';
import { getFilename } from '../utils/StringUtils';

import { s3Buckets } from '../config';

export default {
  name: 'shout',
  create: (req, resource, params, shout, config, callback) => {
    request
      .post('/shouts')
      .prefix()
      .use(req)
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
      .use(req)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err, { resource, params, url: req.url }));
        }
        return callback(null, res.body);
      });
  },
  update: (req, resource, { id }, { shout, removedImages }, config, callback) => {
    request
      .patch(`/shouts/${id}`)
      .prefix()
      .use(req)
      .send(shout)
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback(null, res.body);
      });

    if (removedImages) {
      const { bucket } = s3Buckets.shout;
      AWS.del({ keys: removedImages, bucket });
    }
  },
  delete: (req, resource, { shout }, config, callback) => {
    request
      .delete(`/shouts/${shout.id}`)
      .prefix()
      .use(req)
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback(null, res.body);
      });

    if (shout.images && shout.images.length > 0) {
      const { bucket } = s3Buckets.shout;
      AWS.del({ keys: shout.images.map(url => getFilename(url)), bucket });
    }

  },
};
