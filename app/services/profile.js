import request from "../utils/request";
import { createRequestSession } from "../utils/SessionUtils";
import { parseErrorResponse } from "../utils/APIUtils";

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
          return callback(parseErrorResponse(err));
        }
        createRequestSession(req, res.body);
        return callback(null, res.body.user);
      });
  },
  read: (req, resource, { username }, config, callback) => {
    request
      .get(`/profiles/${username}`)
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
