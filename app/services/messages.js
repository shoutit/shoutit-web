import request from "../utils/request";
import { parseErrorResponse } from "../utils/APIUtils";

export default {
  name: "messages",
  read: (req, resource, { conversationId, endpoint }, config, callback) => {
    const url = endpoint || `/conversations/${conversationId}/messages`;
    request
      .get(url)
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
