import request from '../utils/request';
import { parseApiError } from '../utils/APIUtils';

export default {
  name: 'shoutReply',
  create: (req, resource, { id }, message, config, callback) => {
    request
      .post(`/shouts/${id}/reply`)
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
