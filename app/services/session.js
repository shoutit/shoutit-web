import request from "../utils/request";
import { createRequestSession } from "../utils/SessionUtils";

import {
  AUTH_CLIENT_ID as client_id,
  AUTH_CLIENT_SECRET as client_secret
} from "./constants";


export default {
  name: "session",
  create: (req, resource, params, body, config, callback) => {
    const data = { ...body, client_id, client_secret };
    request
      .post("/oauth2/access_token")
      .send(data)
      .prefix()
      .end((err, res) => {
        if (err) {
          if (err.status !== 400) {
            console.error(err); // eslint-disable-line
            return callback(err);
          }
          const error = new Error("Error getting access token");
          error.statusCode = 400;
          error.output = err.response.body;
          return callback(error);
        }
        createRequestSession(req, res.body);
        return callback(null, res.body);
      });
  },
  read: (req, resource, params, config, callback) => {
    callback(null, req.session && req.session.user ? req.session.user : null);
  },
  delete: (req, resource, params, config, callback) => {
    req.session.destroy(callback);
  }
};
