import request from "../utils/request";
import { parseErrorResponse } from "../utils/APIUtils";

export default {
  name: "conversations",

  read: (req, resource, { id }, config, callback) => {
    let url = "/conversations";
    if (id) {
      url += `/${id}`;
    }
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
  },

  delete: (req, resource, { id }, config, callback) => {
    request
      .del(`/conversations/${id}`)
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
