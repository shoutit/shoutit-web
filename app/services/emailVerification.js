import request from "../utils/request";
import { createRequestSession } from "../utils/SessionUtils";

export default {
  name: "emailVerification",
  create: (req, resource, params, { email }, config, callback) => {
    request
      .post("/auth/verify_email")
      .setSession(req.session)
      .send({ email })
      .prefix()
      .end((err, res) => {
        if (err) {
          if (err.status !== 400) {
            console.error(err); // eslint-disable-line
            return callback(err);
          }
          const error = new Error("Error sending a new e-mail verification");
          error.statusCode = 400;
          error.output = err.response.body.error;
          return callback(error);
        }
        return callback(null, res.body);
      });
  },
  read: (req, resource, { token }, config, callback) => {
    request
      .get(`/auth/verify_email`)
      .query({ token })
      .prefix()
      .end((err, res) => {
        if (err) {
          if (err.status !== 400) {
            console.error(err); // eslint-disable-line
            return callback(err);
          }
          const error = new Error("Error verifying the token");
          error.statusCode = 400;
          error.output = err.response.body.error;
          return callback(error);
        }
        createRequestSession(req, res.body);
        return callback(null, res.body);
      });
  }
};
