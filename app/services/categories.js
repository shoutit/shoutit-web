import request from "../utils/request";
import { parseErrorResponse } from "../utils/APIUtils";

export default {
  name: "categories",
  read: (req, resource, params, config, callback) => {
    request
      .get("/misc/categories")
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(parseErrorResponse(err));
        }
        return callback(null, res.body);
      });
  }
};
