import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'profileChat',
  create: (req, resource, { username }, message, config, callback) => {
    request
      .post(`/profiles/${username}/chat`)
      .send(message)
      .use(req)
      .prefix()
      .camelizeResponseBody()
      .end((err, res) => {
        if (err) {
          callback(parseApiError(err));
          return;
        }
        req.fetchr.read('conversations')
          .params({ id: res.body.conversationId })
          .end(callback);
      });
  },
};
