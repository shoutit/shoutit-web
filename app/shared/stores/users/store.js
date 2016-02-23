import Fluxxor from "fluxxor";
import url from "url";
import consts from "./consts";
import statuses from "../../consts/statuses";
import locConsts from "../locations/consts";
import sugConsts from "../suggestions/consts";
import client from "./client";
import assign from "lodash/object/assign";

const {LISTEN_BTN_LOADING} = statuses;

const PAGE_SIZE = 10;
const REQUEST_TYPE = "request";
const OFFER_TYPE = "offer";
const ALL_TYPE = "all";

function initUserShoutEntry() {
  return {
    offers: null,
    nextOffersPage: null,
    maxOffers: null,
    requests: null,
    nextRequestsPage: null,
    maxRequest: null
  };
}

// data structure for all listening, listeners and tags
function initUserListenEntry() {
  return {
    listeners: {
      loaded: false,
      next: null,
      list: []
    },
    listening: {
      loaded: false,
      next: null,
      list: []
    },
    tags: {
      loaded: false,
      next: null,
      list: []
    },
  };
}

var UserStore = Fluxxor.createStore({
  initialize(props) {
    this.state = {
      user: null,
      users: {},
      listens: {},
      shouts: {},
      loading: false,
      showDownloadPopup: false,
      loggingIn: false,
      loginErrorFields: null,
      signupStatus: {},
      forgetResult: null,
      editors: {},
      verifyResponse: "",
      status: null,
      profile: {
        status: null,
        profilePictureUploading: false,
        coverUploading: false,
        changes: {}
      }
    };

    if (props.loggedUser) {
      let loggedUsername = props.loggedUser.username;
      this.state.users[loggedUsername] = props.loggedUser;
      this.state.user = loggedUsername;
    }

    if (props.user) {
      let username = props.user.username;

      this.state.users[username] = props.user;
      this.state.shouts[username] = initUserShoutEntry();
      this.state.listens[username] = initUserListenEntry();

      if (props.useroffers) {
        let userShouts = this.state.shouts[username],
          loadedOffers = props.useroffers;
        userShouts.offers = loadedOffers.results;
        userShouts.maxOffers = loadedOffers.count;
        userShouts.nextOffersPage = this.parseNextPage(loadedOffers.next);
      }

      if (props.userrequests) {
        let userShouts = this.state.shouts[username],
          loadedRequests = props.userrequests;
        userShouts.requests = loadedRequests.results;
        userShouts.maxRequest = loadedRequests.count;
        userShouts.nextRequestsPage = this.parseNextPage(loadedRequests.next);
      }

      if (props.listeners) {
        let list = props.listeners.results.map(item => item.username);
        this.state.listens[username].listeners.list = list;
        // merging with other users in store
        let listUsers = {};
        props.listeners.results.forEach((item) => {
          return listUsers[item.username] = item;
        });

        assign(this.state.users, listUsers);
      }

      if (props.listening) {
        let list = props.listening.users.map(item => item.username);
        this.state.listens[username].listening.list = list;
        // merging with other users in store
        let listUsers = {};
        props.listening.users.forEach((item) => {
          return listUsers[item.username] = item;
        });

        assign(this.state.users, listUsers);
      }

      if (props.listeningTags) {

        let list = props.listeningTags.tags.map(item => item.name);
        this.state.listens[username].tags.list = list;
        // add tags to tag store
        //this.flux.store('tags').addTags(list);
      }
    }

    this.bindActions(
      consts.RESEND_EMAIL_VERIF, this.onResendEmail,
      consts.VERIFY_EMAIL, this.onEmailVerify,
      consts.FORGET_RESULT, this.onForgetResult,
      consts.SIGNUP_SUCCESS, this.onSignupSuccess,
      consts.SIGNUP_FAIL, this.onSignupFail,
      consts.LOGIN, this.onLogin,
      consts.RESET_LOGIN_ERROR, this.onResetLoginError,
      consts.LOGOUT, this.onLogout,
      consts.PROFILE_CHANGE, this.onProfileChange,
      consts.PROFILE_CHANGES_SAVE, this.onProfileChangesSave,
      consts.PROFILE_PICTURE_UPLOAD, this.onProfilePictureUpload,
      consts.COVER_IMAGE_UPLOAD, this.onCoverImageUpload,
      consts.INFO_CHANGE, this.onInfoChange,
      consts.INFO_SAVE, this.onInfoSave,
      consts.PASS_CHANGE, this.onPassChange,
      consts.LISTEN, this.onListen,
      consts.STOP_LISTEN, this.onStopListen,
      consts.LOAD_USER_LISTENERS, this.onLoadUserListeners,
      consts.LOAD_MORE_USER_LISTENERS, this.onLoadMoreUserListeners,
      consts.LOAD_USER_LISTENING, this.onLoadUserListening,
      consts.LOAD_MORE_USER_LISTENING, this.onLoadMoreUserListening,
      consts.LOAD_USER_TAGS, this.onLoadUserTags,
      consts.LOAD_USER_TAGS_SUCCESS, this.onLoadUserTagsSuccess,
      consts.LOAD_USER_TAGS_FAIL, this.onLoadUserTagsFail,
      consts.LOAD_MORE_USER_TAGS, this.onLoadMoreUserTags,
      consts.LOAD_USER, this.onLoadUser,
      consts.LOAD_USER_SHOUTS, this.onLoadUserShouts,
      consts.LOAD_MORE_USER_SHOUTS, this.onLoadMoreUserShouts,
      consts.SHOW_DOWNLOAD_POPUP, this.onShowDownloadPopup,
      consts.HIDE_DOWNLOAD_POPUP, this.onHideDownloadPopup,
      locConsts.ACQUIRE_LOCATION, this.onAcqireLoc,
      sugConsts.GET_SUGGESTIONS_SUCCESS, this.onGetSuggestionsSuccess
    );
  },

  parseNextPage(nextUrl) {
    if (nextUrl) {
      var parsed = url.parse(nextUrl, true);
      return Number(parsed.query.page);
    }
    return null;
  },

  saveLocation(loc) {
    let patch = {
      location: {
        longitude: loc.longitude,
        latitude: loc.latitude
      }
    };

    if (this.state.user) {
      client.update({location:loc})
        .end((err, res) => {
          if (err) {
            console.log(err);
          } else {
            this.state.users[this.state.user] = res.body;
            this.emit("change");
          }
        });
    }
  },

  /**
   * Fill the store with all the loaded data from suggestion endpoint
   * remember that pages are also users so there is no difference in how we store them
   * @param {res, currentLocation}
   */
  onGetSuggestionsSuccess({ res }) {
    const { users, pages } = res;
    [...users, ...pages].forEach((item, idx) => {
      if (!this.state.users[item.username]) {
        this.state.users[item.username] = item;
      }
    });
    this.emit("change");
  },

  // returns location object if they are properly filled otherwise false
  getLocFromUser() {
    let user = this.state.users[this.state.user];
    if (user === undefined) {
      return false;
    }
    let loc = user.location;

    let isLocationsFilled = loc? loc.country && loc.city && loc.state && loc.latitude && loc.longitude: false;

    if (isLocationsFilled) {
      return loc;
    } else {
      return false;
    }
  },

  onAcqireLoc() {
    let loc = this.getLocFromUser();
    loc? this.flux.store("locations").updateLocation(loc): undefined;
  },

  onEmailVerify(token) {
    client.verify(token)
      .end(function(err, res) {
        if (err) {
          console.log(err);
        } else {
          if (res.status === 200) {
            let loggedUser = res.body;
            if (typeof loggedUser.username !== "undefined") {
              this.state.users[loggedUser.username] = loggedUser;
              this.state.user = loggedUser.username;
              this.state.verifyResponse = "SUCCESS";
              this.emit("change");
              this.emit("login");
            }
          } else {
            this.state.verifyResponse = res.body;
            this.emit("change");
          }

        }
      }.bind(this));
  },

  onSignupSuccess(data) {
    let loggedUser = data;

    this.state.users[loggedUser.username] = loggedUser;
    this.state.user = loggedUser.username;
    this.state.signupStatus = {name:loggedUser.first_name, email:loggedUser.email};
    this.state.signupStatus.status = consts.SIGNUP_SUCCESS;

    this.emit("change");
    this.emit("login");
  },

  onSignupFail(data) {
    this.state.signupStatus = data;
    this.state.signupStatus.status = consts.SIGNUP_FAIL;
    this.emit("change");
  },

  onForgetResult(payload) {
    if (payload.email) {
      this.state.forgetResult = payload.email[0];
    } else if (payload.success) {
      this.state.forgetResult = payload.success;
    }
    this.emit("change");
  },

  onLogin({ token, type }) {
    this.state.loggingIn = true;
    this.emit("change");
    client.login(token, type).end((err, res) => {
      this.state.loggingIn = false;
      if (err) {
        this.state.loginErrorFields = {
          unknown: ["Unknown error during login, please try again."]
        };
        console.error(err);
        this.emit("change");
        return;
      }
      if (!res.ok) { // API error
        this.state.loginErrorFields = res.body;
        this.emit("change");
        return;
      }
      const loggedUser = res.body;
      // keeping the login type here
      loggedUser.loggedInWith = type;
      this.state.users[loggedUser.username] = loggedUser;
      this.state.user = loggedUser.username;
      this.state.loginErrorFields = null;
      this.emit("change");
      this.emit("login");
    });
  },

  onResetLoginError() {
    this.state.loginErrorFields = null;
    this.emit("change");
  },

  onLogout() {
    client.logout()
      .end(function (err, res) {
        if (err) {
          console.error(err);
        } else if (res.status === 200 && res.body.loggedOut) {
          this.state.user = null;
          this.emit("change");
          this.emit("logout");
        }
      }.bind(this));
  },

  onProfileChange(payload) {
    let {changes} = payload;
    assign(this.state.profile.changes, changes);
    this.emit("change");
  },

  onProfileChangesSave() {
    // clear status
    this.state.profile.status = "saving";
    this.emit("change");
    // patch the changes
    const user = this.state.user;
    const patch = this.state.profile.changes;

    const isPatchable = this.state.users[user].is_owner && Object.keys(patch).length > 0;

    if (isPatchable) {
      client.update(patch).end((err, res) => {
        if (err) {
          console.log(err);
        } else {
          if (res.status !== 200) {
            if (res.body) {
                    const err = res.body;
                    this.state.profile.status = "err";
                    this.state.profile.errors = res.body;
                    this.emit("change");
                  }
          } else {
            const username = res.body.username;
            if (username) {
                    this.state.users[username] = res.body;
                  }
            this.state.profile.status = "saved";
            this.emit("change");
          }
        }
        // clear changes
        this.state.profile.changes = {};
      });
    }
  },

  onProfilePictureUpload(payload) {
    this.state.profile.profilePictureUploading = true;
    this.emit("change");
    // uploading to user bucket
    client.uploadDataImage(payload.editedImage, "user")
            .end((err, res) => {
              if (err) {
                console.log(err);
              } else {
                if (res.status === 200) {
                  const s3Link = res.text;
                  this.onProfileChange({
                    changes: {image: s3Link}
                  });
                } else {
                  console.log("Error on saving file.");
                }
              }
              this.state.profile.profilePictureUploading = false;
              this.emit("change");
            });
  },

  onCoverImageUpload(payload) {
    this.state.profile.coverUploading = true;
    this.emit("change");
    // uploading to user bucket
    client.uploadDataImage(payload.editedImage, "user")
            .end((err, res) => {
              if (err) {
                console.log(err);
              } else {
                if (res.status === 200) {
                  const s3Link = res.text;
                  this.onProfileChange({
                    changes: {cover: s3Link}
                  });
                        // now save changes
                  this.onProfileChangesSave();
                } else {
                  console.log(res);
                  console.log("Error on saving file.");
                }
              }
              this.state.profile.coverUploading = false;
              this.emit("change");
            });
  },

  onInfoChange(payload) {
    if (this.state.user[payload.field]) {
      this.state.user[payload.field] = payload.value;
    }
    this.emit("change");
  },

  onPassChange(dataPackage) {
    this.state.editors["password"] = {};
    this.state.editors["password"].loading = true;
    this.emit("change");

    client.changePass(dataPackage).end(function(err,res) {
      if (err) {
        console.log(err);
        this.state.editors["password"].loading = false;
      } else {
        if (res.body.success) {
          this.state.editors["password"] = {loading: false,msg:res.body.success};
        } else {
          // find errors
          if (res.body)
            this.state.editors["password"] =
            {loading: false,msg:"Current password does not match!"};
        }
      }
      this.emit("change");
    }.bind(this));
  },

  augmentPatch(field, value) {
    let apiMap = {
      email: {email: value},
      username: {username: value},
      address: {
        location: {
          address:value
        }
      }
    };

    return apiMap[field];
  },


  onInfoSave(payload) {
    let field = payload.field;
    this.state.editors[field] = {};
    this.state.editors[field].loading = true;
    this.emit("change");

    let user = this.state.user;
    let patch = this.augmentPatch(field, payload.value);

    if (this.state.users[user]) {

      client.update(patch).end(function (err, res) {
        if (err) {
          console.log(err);
        } else {
          this.state.editors[field].loading = false;
          if (res.status !== 200) {
            if (res.body[field]) {
                    let err = res.body[field][0];
                    this.state.editors[field] = {loading: false,msg:err};
                    this.state.loading = false;
                    this.emit("change");
                  }
          } else {
            var loggedUser = res.body;
            this.state.users[loggedUser.username] = loggedUser;
            this.state.user = loggedUser.username;
            this.state.editors[field] = {loading: false};
            this.state.loading = false;
            this.emit("change");
          }

        }
      }.bind(this));
    }
    this.state.loading = true;
    this.emit("change");
  },

  onResendEmail() {
    let user = this.state.users[this.state.user];
    if (user) {
      client.resendEmail(user.email).end();
    }
  },

  onListen(payload) {
    var username = payload.username;
    // set loading status
    this.state.users[username].fluxStatus = LISTEN_BTN_LOADING;
    this.emit("change");

    client.listen(username).end(function (err, res) {
      if (err) {
        console.log(err);
      } else if (res.body.success) {
        // Update users Listening/Listeners count List without getting data from API
        if (this.state.users[username].hasOwnProperty("listeners_count")) {
          let counts = Number(this.state.users[username].listeners_count);
          this.state.users[username].listeners_count = counts + 1;
        }
        if (this.state.users[this.state.user].listening_count) {
          let counts = Number(this.state.users[this.state.user].listening_count.users);
          this.state.users[this.state.user].listening_count.users = counts + 1;
        }

        // optimistically change button condition till the real data loads
        this.state.users[username].is_listening = true;
        this.state.users[username].fluxStatus = null;
        this.emit("change");
      }
    }.bind(this));
  },

  onStopListen(payload) {
    var username = payload.username;
    // set loading status
    this.state.users[username].fluxStatus = LISTEN_BTN_LOADING;
    this.emit("change");

    client.stopListen(username)
      .end(function (err, res) {
        if (err) {
          console.log(err);
        } else if (res.body.success) {
          // Update users Listening/Listeners count List without getting data from API
          if (this.state.users[username].hasOwnProperty("listeners_count")) {
            let counts = Number(this.state.users[username].listeners_count);
            this.state.users[username].listeners_count = counts - 1;
          }
          if (this.state.users[this.state.user].listening_count) {
            let counts = Number(this.state.users[this.state.user].listening_count.users);
            this.state.users[this.state.user].listening_count.users = counts - 1;
          }

          // optimistically change button condition till the real data loads
          this.state.users[username].is_listening = false;
          this.state.users[username].fluxStatus = null;
          this.emit("change");
        }
      }.bind(this));
  },

  onLoadUserListeners(payload) {
    var username = payload.username;

    client.getListeners(username).end(function (err, res) {
      if (err) {
        console.log(err);
      } else {
        const next = this.parseNextPage(res.body.next);
        const list = res.body.results.map(item => item.username);

        // making an object with usernames as key values to be merged with other users in store
        let listUsers = {};
        res.body.results.forEach((item) => {
          return listUsers[item.username] = item;
        });

        assign(this.state.users, listUsers);

        this.state.listens[username].listeners.list = list;
        this.state.listens[username].listeners.next = next;
        this.state.listens[username].listeners.loaded = true;

      }
      this.state.loading = false;
      this.emit("change");
    }.bind(this));

    this.state.loading = true;
    this.emit("change");
  },

  onLoadMoreUserListeners(payload) {
    let username = payload.username;
    let current = this.state.listens[username].listeners.next;

    if (current) {
      client.getListeners(username, {page: current})
        .end((err, res) => {
          if (err) {
            console.log(err);
          } else {
            const next = this.parseNextPage(res.body.next);
            const list = res.body.results.map(item => item.username);
            let stock = this.state.listens[username].listeners.list;

            // making an object with usernames as key values to be merged with other users in store
            let listUsers = {};
            res.body.results.forEach((item) => {
              listUsers[item.username] = item;
            });

            assign(this.state.users, listUsers);

            stock = [...stock, ...list];
            this.state.listens[username].listeners.list = stock;
            this.state.listens[username].listeners.next = next;

            this.state.loading = false;
            this.emit("change");
          }
        });

      this.state.loading = true;
      this.emit("change");
    }

  },

  onLoadUserListening(payload) {
    var username = payload.username;

    if (!this.state.listens[username]) {
      this.state.listens[username] = initUserListenEntry();
    }

    client.getListening(username).end((err, res) => {
      if (err) {
        console.log(err);
      } else {
        const next = this.parseNextPage(res.body.next);
        const list = res.body.users.map(item => item.username);

        // making an object with usernames as key values to be merged with other users in store
        const listUsers = {};
        res.body.users.forEach((item) => {
          listUsers[item.username] = item;
        });

        assign(this.state.users, listUsers);

        this.state.listens[username].listening.list = list;
        this.state.listens[username].listening.next = next;
        this.state.listens[username].listening.loaded = true;
      }
      this.state.loading = false;
      this.emit("change");
    });

    this.state.loading = true;
    this.emit("change");
  },

  onLoadMoreUserListening(payload) {
    let username = payload.username;
    let current = this.state.listens[username].listening.next;

    if (current) {
      client.getListening(username, {page: current})
        .end((err, res) => {
          if (err) {
            console.log(err);
          } else {
            const next = this.parseNextPage(res.body.next);
            const list = res.body.users.map(item => item.username);
            let stock = this.state.listens[username].listening.list;

            // making an object with usernames as key values to be merged with other users in store
            const listUsers = {};
            res.body.users.forEach((item) => {
              return listUsers[item.username] = item;
            });

            assign(this.state.users, listUsers);

            stock = [...stock, ...list];
            this.state.listens[username].listening.list = stock;
            this.state.listens[username].listening.next = next;

            this.state.loading = false;
            this.emit("change");
          }
        });

      this.state.loading = true;
      this.emit("change");
    }
  },

  onLoadUserTags() {
    this.state.loading = true;
    this.emit("change");
  },

  onLoadUserTagsSuccess(payload) {
    this.waitFor(["tags"], function() {
      const { username, res } = payload;

      const next = this.parseNextPage(res.next);
      const list = res.tags.map(item => item.name);

      this.state.listens[username].tags.list = list;
      this.state.listens[username].tags.next = next;
      this.state.listens[username].tags.loaded = true;

      this.state.loading = false;
      this.emit("change");
    });

  },

  onLoadUserTagsFail() {
    this.state.loading = false;
    this.emit("change");
  },

  onLoadMoreUserTags(payload) {
    var username = payload.username;
    let current = this.state.listens[username].tags.next;

    if (current) {

      client.getTags(username, {page: current})
        .end((err, res) => {
          if (err) {
            console.log(err);
            return;
          }
          let next = this.parseNextPage(res.body.next);
          let stock = this.state.listens[username].tags.list;
          let list = res.body.tags.map(item => item.name);
          stock = [...stock, ...list];

          this.state.listens[username].tags.list = stock;
          this.state.listens[username].tags.next = next;

          // add tags to tag store
          this.flux.store("tags").addTags(res.body.tags);

          this.state.loading = false;
          this.emit("change");
        });

      this.state.loading = true;
      this.emit("change");
    }
  },

  onLoadUserShouts(payload) {
    var username = payload.username,
      type = payload.type;

    client.loadShouts(username, {
      shout_type: type || ALL_TYPE,
      page_size: payload.limit? payload.limit: PAGE_SIZE
    }).end(function (err, res) {
      if (err) {
        console.log(err);
      } else {
        this.onLoadUserShoutsSuccess({
          username: username,
          result: res.body,
          type: type
        });
      }
    }.bind(this));
    this.state.loading = true;
    this.emit("change");
  },

  onLoadUserShoutsSuccess(payload) {
    let username = payload.username,
      type = payload.type;

    if (!this.state.shouts[username]) {
      this.state.shouts[username] = initUserShoutEntry();
    }
    let userShouts = this.state.shouts[username],
      loadedShouts = payload.result;

    if (type === "offer") {
      userShouts.offers = loadedShouts.results;
      userShouts.maxOffers = loadedShouts.count;
      userShouts.nextOffersPage = this.parseNextPage(loadedShouts.next);
    } else if (type === "request") {
      userShouts.requests = loadedShouts.results;
      userShouts.maxRequest = Number(loadedShouts.count);
      userShouts.nextRequestsPage = this.parseNextPage(loadedShouts.next);
    }

    this.state.loading = false;
    this.emit("change");
  },

  onLoadMoreUserShouts(payload) {
    let username = payload.username,
      type = payload.type;

    let userShouts = this.state.shouts[username],
      nextPage;

    if (type === OFFER_TYPE) {
      nextPage = userShouts.nextOffersPage;
    } else if (type === REQUEST_TYPE) {
      nextPage = userShouts.nextRequestsPage;
    }

    if (nextPage) {
      client.loadShouts(username, {
        shout_type: type || ALL_TYPE,
        page_size: PAGE_SIZE,
        page: nextPage
      }).end(function (err, res) {
        if (err) {
          console.log(err);
        } else {
          this.onLoadMoreUserShoutsSuccess({
                  username: username,
                  result: res.body,
                  type: type
                });
        }
      }.bind(this));
      this.state.loading = true;
      this.emit("change");
    }
  },

  onLoadMoreUserShoutsSuccess(payload) {
    let username = payload.username,
      type = payload.type;

    if (!this.state.shouts[username]) {
      this.state.shouts[username] = initUserShoutEntry();
    }
    let userShouts = this.state.shouts[username],
      loadedShouts = payload.result;

    if (type === "offer") {
      loadedShouts.results.forEach(function(val) {
        userShouts.offers.push(val);
      }.bind(this));
      userShouts.maxOffers = Number(loadedShouts.count);
      userShouts.nextOffersPage = this.parseNextPage(loadedShouts.next);
    } else if (type === "request") {
      loadedShouts.results.forEach(function(val) {
        userShouts.requests.push(val);
      }.bind(this));
      userShouts.maxRequest = Number(loadedShouts.count);
      userShouts.nextRequestsPage = this.parseNextPage(loadedShouts.next);
    }

    this.state.loading = false;
    this.emit("change");
  },

  onLoadUser(payload) {
    const username = payload.username;
    const {users, listens} = this.state;
    const isUserFullyLoaded = Boolean(users[username] && users[username].location && listens[username]);
    const isLoading = users[username]? users[username].loading: false;

    // Checking to see if the user is already fully loaded
    if (!isUserFullyLoaded && !isLoading) {
      client.get(username)
        .end(function (err, res) {
          if (err || res.status !== 200) {
            this.onLoadUserFailed({
              username: username
            });
          } else {
            this.onLoadUserSuccess({
              username: username,
              res: res.body
            });
          }
        }.bind(this));

      if (!users[username]) { users[username] = {}; }
      users[username].loading = true;
      this.emit("change");
    }
  },

  onLoadUserSuccess(payload) {
    const {username, res} = payload;
    let userShouts = this.state.shouts[username];
    let listensShouts = this.state.listens[username];

    this.state.users[username] = res;

    if (!userShouts) {
      userShouts = initUserShoutEntry();
    }
    if (!listensShouts) {
      listensShouts = initUserListenEntry();
    }
    this.onLoadUserListeners(payload);
    this.onLoadUserListening(payload);

    this.state.users[username].loading = false;
    this.emit("change");
  },

  onLoadUserFailed({username}) {
    this.state.users[username] = null;
    this.emit("change");
  },

  onShowDownloadPopup() {
    this.state.showDownloadPopup = true;
    this.emit("change");
  },

  onHideDownloadPopup() {
    this.state.showDownloadPopup = false;
    this.emit("change");
  },

  setFluxStatus(status) {
    this.state.status = status;
    this.emit("change");
    //clearing status to avoid displaying old messages
    setTimeout(() => {
      this.state.status = null;
      this.emit("change");
    },0);
  },

  serialize() {
    return JSON.stringify(this.state);
  },

  hydrate(json) {
    this.state = JSON.parse(json);
  },

  getState() {
    return this.state;
  },

  getUsersState() {
    return JSON.parse(JSON.stringify(this.state.users));
  },

  getLoggedUser() {
    return this.state.users[this.state.user];
  }
});

export default UserStore;
