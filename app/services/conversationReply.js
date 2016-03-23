import request from "../utils/request";
import { parseErrorResponse } from "../utils/APIUtils";

export default {
  name: "conversationReply",
  create: (req, resource, { conversationId }, body, config, callback) => {
    request
      .post(`/conversations/${conversationId}/reply`)
      .send(body)
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
