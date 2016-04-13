import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'shoutReply',
  create: (req, resource, { shout }, message, config, callback) => {
    request
      .post(`/shouts/${shout.id}/reply`)
      .send(message)
      .setSession(req.session)
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
          .setSession(req.session)
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
