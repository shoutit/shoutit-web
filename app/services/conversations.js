import request from "../utils/request";
import { parseErrorResponse } from "../utils/APIUtils";

export default {
  name: "conversations",
  read: (req, resource, params, config, callback) => {
    request
      .get("/conversations")
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
