import request from "superagent";

const PREFIX = "/api/users";
const AUTH_PREFIX = "/api/auth";

// Only for uploading base64 (data URI) images
// for uploading image files use /services/image_upload
const S3_ENDPOINT = "/services/data_image_upload";

export default {
  update(update) {
    return request
            .post(PREFIX + "/me")
            .type("json")
            .accept("json")
            .send(update);
  },

  changePass(query) {
    return request
            .post(AUTH_PREFIX + "/change_password")
            .send(query);
  },

  resendEmail(email) {
    return request
            .post(AUTH_PREFIX + "/verify_email")
            .send({email:email});
  },

  verify(payload) {
    return request
            .get("/services/verify_email")
            .query({verify_token: payload.token});

  },

  get(username) {
    return request
            .get(PREFIX + "/" + username);
  },

  getListening(username, query) {
    return request
            .get(PREFIX + "/" + username + "/listening")
            .query(query);
  },

  getTags(username, query = {}) {
    query.type = "tags";
        
    return request
            .get(PREFIX + "/" + username + "/listening")
            .query(query);
  },

  getListeners(username, query) {
    return request
            .get(PREFIX + "/" + username + "/listeners")
            .query(query);
  },

  listen(username) {
    return request
            .post(PREFIX + "/" + username + "/listen");
  },

  stopListen(username) {
    return request
            .del(PREFIX + "/" + username + "/listen");
  },

  loadShouts(username, query) {
    return request
            .get(PREFIX + "/" + username + "/shouts")
            .query(query);
  },

  list(query) {
    return request
            .get(PREFIX + "/")
            .query(query);
  },

    /** 
     * This function uploads base64 Data URI images to S3 server to any buckets
     *
     * @param {String} dataImage Data URI image string
     * @param {String} bucket - not full bucket name only short name like : user|shout|tag
     * @returns {object} with .end(err, res) method which could be used to retrieve S3 Link
     */
  uploadDataImage(dataImage, bucket) {
    return request
                .post(S3_ENDPOINT, bucket)
                .send({dataImage, bucket});
  },

  signup(payload) {
    return request
            .post("/auth/signup")
            .type("json")
            .accept("json")
            .send(payload);
  },

  forgetPass(email) {
    return request
            .post("/auth/forget")
            .type("json")
            .accept("json")
            .send({email:email});
  },

  login(token, type) {
    let endpoint;
    let dataPackage = {token:token};

    if (type === "gplus")
      endpoint = "/auth/gplus";
        else if (type === "fb")
          endpoint = "/auth/fb";
        else if (type === "shoutit") {
          endpoint = "/auth/shoutit";
          dataPackage = {email:token.email,pass:token.pass};
        }

    return request
            .post(endpoint)
            .type("json")
            .accept("json")
            .send(dataPackage);
  },

  logout() {
    return request.get("/auth/logout")
            .accept("json");
  }
};
