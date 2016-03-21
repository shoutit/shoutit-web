import request from "../utils/request";
import { parseErrorResponse } from "../utils/APIUtils";

export default {
  name: "messages",
  read: (req, resource, { conversationId, after, before }, config, callback) => {
    request
      .get(`/conversations/${conversationId}/messages`)
      .query({ after, before })
      .setSession(req.session)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseErrorResponse(err));
        }
        return callback(null, res.body);
      });
  }
};
