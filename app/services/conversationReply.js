import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'conversationReply',
  create: (req, resource, { conversationId }, body, config, callback) => {
    request
      .post(`/conversations/${conversationId}/reply`)
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
