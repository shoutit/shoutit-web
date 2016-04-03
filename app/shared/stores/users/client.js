import request from 'superagent';

const PREFIX = '/api/users';
const AUTH_PREFIX = '/api/auth';
const SHOUTS_PREFIX = '/api/shouts';

export default {
  update(update) {
    return request
            .post(PREFIX + '/me')
            .type('json')
            .accept('json')
            .send(update);
  },

  changePass(query) {
    return request
            .post(AUTH_PREFIX + '/change_password')
            .send(query);
  },

  get(username) {
    return request
            .get(PREFIX + '/' + username);
  },

  getListening(username, query) {
    return request
            .get(PREFIX + '/' + username + '/listening')
            .query(query);
  },

  getTags(username, query = {}) {
    query.type = 'tags';

    return request
            .get(PREFIX + '/' + username + '/listening')
            .query(query);
  },

  getListeners(username, query) {
    return request
            .get(PREFIX + '/' + username + '/listeners')
            .query(query);
  },

  listen(username) {
    return request
            .post(PREFIX + '/' + username + '/listen');
  },

  stopListen(username) {
    return request
            .del(PREFIX + '/' + username + '/listen');
  },

  loadShouts(username, query = {}) {
    query.profile = username;

    return request
      .get(SHOUTS_PREFIX)
      .query(query);
  },

  list(query) {
    return request
            .get(PREFIX + '/')
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
                .post(`/services/images/${bucket}`)
                .send({ dataImage });
  },

};
