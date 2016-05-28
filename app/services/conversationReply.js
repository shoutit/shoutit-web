import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'conversationReply',
  create: (req, resource, { id }, body, config, callback) => {
    if (body.attachments) {
      // denormalize attachments
      body.attachments = body.attachments.map(attachment => {
        if (attachment.shout) {
          attachment.shout = { id: attachment.shout };
        }
        if (attachment.profile) {
          attachment.profile = { id: attachment.profile };
        }
        return attachment;
      });
    }
    request
      .post(`/conversations/${id}/reply`)
      .send(body)
      .setSession(req.session)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseApiError(err));
        }
        return callback(null, res.body);
      });
  },
};
