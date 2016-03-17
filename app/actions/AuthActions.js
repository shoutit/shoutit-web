import * as actionTypes from "./actionTypes";

export default {

  loginWithGoogle({ gplus_code, user }) {
    const params = { gplus_code, user, grant_type: "gplus_code" };
    this.flux.actions.login(params);
  },

  loginWithFacebook({ facebook_access_token, user }) {
    const params = { facebook_access_token, user, grant_type: "facebook_access_token" };
    this.flux.actions.login(params);
  },

  login({ grant_type="shoutit_login", ...params}) {
    const data = { ...params, grant_type };
    this.dispatch(actionTypes.LOGIN_START, {
      data: { grant_type: grant_type}
    });
    this.flux.service
      .create("session")
      .body(data)
      .end((error, data) => {
        if (error) {
          this.dispatch(actionTypes.LOGIN_FAILURE, {
            data: { grant_type: grant_type},
            error
          });
          return;
        }
        this.dispatch(actionTypes.LOGIN_SUCCESS, data);
      });
  },

  getCurrentSession(done) {
    this.flux.service
      .read("session")
      .end((err, user) => {
        if (user) {
          this.dispatch(actionTypes.LOGIN_SUCCESS, { user });
        }
        done && done(null, user);
      });
  },

  signup({ name, email, password, user }) {
    const data = { name, email, password, user };
    this.dispatch(actionTypes.SIGNUP_START, { name, email, user });
    this.flux.service
      .create("profile")
      .body(data)
      .end((error, data) => {
        if (error) {
          this.dispatch(actionTypes.SIGNUP_FAILURE, {
            data: { name, email, user},
            error
          });
          return;
        }
        this.dispatch(actionTypes.SIGNUP_SUCCESS, data);
      });
  },

  resetAuthErrors() {
    this.dispatch(actionTypes.RESET_AUTH_ERRORS);
  },

  logout(history) {
    this.dispatch(actionTypes.LOGOUT);
    this.flux.service.delete("session").end();
    if (history) {
      history.pushState(null, "/");
    }
  },

  requestPasswordReset(email, done) {
    this.dispatch(actionTypes.PASSWORD_RESET_START);
    this.flux.service
      .create("passwordReset")
      .body({ email })
      .end((error) => {
        if (error) {
          this.dispatch(actionTypes.PASSWORD_RESET_FAILURE, { error });
          done && done(error);
          return;
        }
        this.dispatch(actionTypes.PASSWORD_RESET_SUCCESS);
        done && done();
      });
  },

  verifyEmail(token) {
    this.dispatch(actionTypes.EMAIL_VERIFICATION_START);
    this.flux.service
      .read("emailVerification")
      .params({ token })
      .end((error, data) => {
        if (error) {
          this.dispatch(actionTypes.EMAIL_VERIFICATION_FAILURE, { error });
          return;
        }
        this.dispatch(actionTypes.EMAIL_VERIFICATION_SUCCESS, data);
      });
  },

  sendEmailVerification(email, done) {
    this.dispatch(actionTypes.SEND_EMAIL_VERIFICATION_START, { email });
    this.flux.service
      .create("emailVerification")
      .params({ email })
      .end((error, data) => {
        if (error) {
          this.dispatch(actionTypes.SEND_EMAIL_VERIFICATION_FAILURE, { error, email });
          done && done(error);
          return;
        }
        this.dispatch(actionTypes.SEND_EMAIL_VERIFICATION_SUCCESS, data);
        done && done();
      });
  }

};
