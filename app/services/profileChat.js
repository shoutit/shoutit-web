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
      .end((err, res) => {
        if (err) {
          callback(parseApiError(err));
          return;
        }
        const message = res.body;

        // Request the conversation data
        request
          .get(`/conversations/${message.conversation_id}`)
          .use(req)
          .prefix()
          .end((err, res) => {
            if (err) {
              callback(parseApiError(err));
              return;
            }
            const conversation = res.body;
            callback(null, conversation);

          });
      });
  },
};
