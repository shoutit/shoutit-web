import request from "../utils/request";

export default {
  name: "passwordReset",
  create: (req, resource, params, { email }, config, callback) => {
    request
      .post("/auth/reset_password")
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
          error.output = err.response.body;
          return callback(error);
        }
        return callback(null, res.body);
      });
  }
};
