import request from "../utils/request";
import { createRequestSession } from "../utils/SessionUtils";

import {
  AUTH_CLIENT_ID as client_id,
  AUTH_CLIENT_SECRET as client_secret
} from "./constants";

export default {
  name: "profile",
  create: (req, resource, params, body, config, callback) => {
    const { name, email, password } = body;
    const data = { name, email, password, client_id, client_secret, grant_type: "shoutit_signup" };
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
          const error = new Error("Error creating a new account");
          error.statusCode = 400;
          error.output = err.response.body;
          return callback(error);
        }
        createRequestSession(req, res.body);
        return callback(null, res.body);
      });
  },
  read: (req, resource, { username }, config, callback) => {
    request
      .get(`/profiles/${username}`)
      .setSession(req.session)
      .prefix()
      .end((err, res) => {
        if (err) {
          return callback(err);
        }
        return callback(null, res.body);
      });
  }
};
