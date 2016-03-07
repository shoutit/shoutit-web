import * as ActionTypes from "./AuthActionTypes";

export const actions = {

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
    this.dispatch(ActionTypes.LOGIN_START, {
      data: { grant_type: grant_type}
    });
    this.flux.service
      .create("session")
      .body(data)
      .end((error, data) => {
        if (error) {
          this.dispatch(ActionTypes.LOGIN_FAILURE, {
            data: { grant_type: grant_type},
            error
          });
          return;
        }
        this.dispatch(ActionTypes.LOGIN_SUCCESS, data);
      });
  },

  signup({ name, email, password, user }) {
    const data = { name, email, password, user };
    this.dispatch(ActionTypes.SIGNUP_START, { name, email, user });
    this.flux.service
      .create("profile")
      .body(data)
      .end((error, data) => {
        if (error) {
          this.dispatch(ActionTypes.SIGNUP_FAILURE, {
            data: { name, email, user},
            error
          });
          return;
        }
        this.dispatch(ActionTypes.SIGNUP_SUCCESS, data);
      });
  },

  resetAuthErrors() {
    this.dispatch(ActionTypes.RESET_AUTH_ERRORS);
  },

  logout() {
    this.flux.service
      .delete("session")
      .end((error) => {
        if (error) {
          console.error(error) // eslint-disable-line
          return;
        }
        this.dispatch(ActionTypes.LOGOUT);
      });
  },

  verifyEmail(token) {
    this.dispatch(ActionTypes.EMAIL_VERIFICATION_START);
    this.flux.service
      .read("emailVerification")
      .params({ token })
      .end((error, data) => {
        if (error) {
          this.dispatch(ActionTypes.EMAIL_VERIFICATION_FAILURE, { error });
          return;
        }
        this.dispatch(ActionTypes.EMAIL_VERIFICATION_SUCCESS, data);
      });
  },

  sendEmailVerification(email) {
    this.dispatch(ActionTypes.SEND_EMAIL_VERIFICATION_START, { email });
    this.flux.service
      .create("emailVerification")
      .params({ email })
      .end((error, data) => {
        if (error) {
          this.dispatch(ActionTypes.SEND_EMAIL_VERIFICATION_FAILURE, { error, email });
          return;
        }
        this.dispatch(ActionTypes.SEND_EMAIL_VERIFICATION_SUCCESS, data);
      });
  }

};
