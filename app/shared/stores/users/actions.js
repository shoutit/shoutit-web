import consts from './consts';
import client from './client';

export default {

  profileChange(changes) {
    this.dispatch(consts.PROFILE_CHANGE, {
      changes,
    });
  },

  saveProfileChanges() {
    this.dispatch(consts.PROFILE_CHANGES_SAVE);
  },

  uploadProfilePicture(editedImage) {
    this.dispatch(consts.PROFILE_PICTURE_UPLOAD, {
      editedImage,
    });
  },

  uploadCoverImage(editedImage) {
    this.dispatch(consts.COVER_IMAGE_UPLOAD, {
      editedImage,
    });
  },

  changeInfo(field, value) {
    this.dispatch(consts.INFO_CHANGE, {
      field: field,
      value: value,
    });
  },

  saveInfo(field, value) {
    this.dispatch(consts.INFO_SAVE, {
      field: field,
      value: value,
    });
  },

  changePass(payload) {
    let dataPackage = {};
    if (payload.value.length === 3) {
      dataPackage.old_password = payload.value[0];
      dataPackage.new_password = payload.value[1];
      dataPackage.new_password2 = payload.value[2];
    } else {
      dataPackage.new_password = payload.value[0];
      dataPackage.new_password2 = payload.value[1];
    }
    this.dispatch(consts.PASS_CHANGE, dataPackage);
  },

  listen(username) {
    client.listen(username).end((err, res) => {
      if (err || !res.ok) {
        this.dispatch(consts.LISTEN_FAIL, { username, err });
        return;
      }
      this.dispatch(consts.LISTEN_SUCCESS, { username });
    });

    this.dispatch(consts.LISTEN, { username });
  },

  stopListen(username) {
    client.stopListen(username)
      .end((err, res) => {
        if (err || !res.ok) {
          this.dispatch(consts.STOP_LISTEN_FAIL, { username, err });
          return;
        }
        this.dispatch(consts.STOP_LISTEN_SUCCESS, { username });
      });
    this.dispatch(consts.STOP_LISTEN, { username });
  },

  loadUserListening(username) {
    this.dispatch(consts.LOAD_LISTENING, {
      username: username,
    });
  },

  loadMoreUserListening(username) {
    this.dispatch(consts.LOAD_MORE_USER_LISTENING, {
      username: username,
    });
  },

  loadUserListeningTags(username) {
    client.getTags(username).end((err, res) => {
      if (err) {
        this.dispatch(consts.LOAD_USER_TAGS_FAIL);
      } else {
        if (res.body.tags) {
          this.dispatch(consts.LOAD_USER_TAGS_SUCCESS, { res: res.body, username: username });
        }
      }
    });
    this.dispatch(consts.LOAD_USER_TAGS);
  },

  loadMoreUserListeningTags(username) {
    this.dispatch(consts.LOAD_MORE_USER_TAGS, {
      username: username,
    });
  },

  loadUserListeners(username) {
    this.dispatch(consts.LOAD_USER_LISTENERS, {
      username: username,
    });
  },

  loadMoreUserListeners(username) {
    this.dispatch(consts.LOAD_MORE_USER_LISTENERS, {
      username: username,
    });
  },

  loadUserShouts(username, type, limit = 0) {
    let query = {};
    query.username = username;
    query.type = type;
    if (limit) {query.limit = limit;}

    this.dispatch(consts.LOAD_USER_SHOUTS, query);
  },

  loadMoreUserShouts(username, type) {
    this.dispatch(consts.LOAD_MORE_USER_SHOUTS, {
      username: username,
      type: type,
    });
  },

  loadUser(username) {
    this.dispatch(consts.LOAD_USER, {
      username: username,
    });
  },

  showDownloadPopup() {
    this.dispatch(consts.SHOW_DOWNLOAD_POPUP);
  },

  hideDownloadPopup() {
    this.dispatch(consts.HIDE_DOWNLOAD_POPUP);
  },
};
