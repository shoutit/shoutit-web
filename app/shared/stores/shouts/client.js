import request from "superagent";

const PREFIX = "/api/shouts";

export default {
  list(query) {
    return request
      .get(PREFIX + "/")
      .query(query);
  },

  getRelatedShouts(shoutId) {
    return request
      .get(PREFIX + "/" + shoutId + "/related");
  },

  get(shoutId) {
    return request
      .get(PREFIX + "/" + shoutId);
  },

  create(shout) {
    return request
      .post(PREFIX + "/")
      .send(shout);
  },

  remove(fileName) {
    return request
      .query({ fileName })
      .del("/services/images");
  },

  reply(shoutId, message) {
    return request.post(PREFIX + "/" + shoutId + "/reply")
      .send(message);
  }
};
