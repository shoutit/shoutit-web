import request from "../utils/request";

export default {
  name: "messages",
  read: (req, resource, { id, after, before }, config, callback) => {
    request
      .get(`/conversations/${id}/messages`)
      .query({ after, before })
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
