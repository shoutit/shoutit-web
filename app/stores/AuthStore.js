import Fluxxor from "fluxxor";
import * as actionTypes from "../actions/actionTypes";

const defaultState = {

  isSigningUp: false,
  isLoggingIn: false,

  isLoggingInWithGoogle: false,
  googleLoginError: false,

  isLoggingInWithFacebook: false,
  facebookLoginError: null,

  loginError: false,
  signupError: false,

  isVerifyingEmail: false,
  emailVerificationError: null,

  loggedUsername: null,
  loggedUserId: null,
  isNewSignup: false,

  isRequestingPasswordReset: false,
  passwordResetError: null

};

export default Fluxxor.createStore({

  initialize(initialState) {

    this.state = {...defaultState, ...initialState};

    this.bindActions(

      actionTypes.LOGIN_START, this.handleLoginStart,
      actionTypes.LOGIN_SUCCESS, this.handleLoginSuccess,
      actionTypes.LOGIN_FAILURE, this.handleLoginFailure,

      actionTypes.SIGNUP_START, this.handleSignupStart,
      actionTypes.SIGNUP_SUCCESS, this.handleSignupSuccess,
      actionTypes.SIGNUP_FAILURE, this.handleSignupFailure,

      actionTypes.RESET_AUTH_ERRORS, this.handleResetErrors,

      actionTypes.EMAIL_VERIFICATION_START, this.handleEmailVerificationStart,
      actionTypes.EMAIL_VERIFICATION_SUCCESS, this.handleLoginSuccess,
      actionTypes.EMAIL_VERIFICATION_FAILURE, this.handleEmailVerificationFailure,

      actionTypes.PASSWORD_RESET_START, this.handlePasswordResetStart,
      actionTypes.PASSWORD_RESET_SUCCESS, this.handlePasswordResetSuccess,
      actionTypes.PASSWORD_RESET_FAILURE, this.handlePasswordResetFailure,

      actionTypes.LOGOUT, this.handleLogout

    );

  },

  getState() {
    return this.state;
  },

  getLoggedProfile() {
    return this.flux.stores.UsersStore.get(this.state.loggedUserId);
  },

  handleLoginStart({ data }) {
    this.state.isLoggingIn = true;

    switch (data.grant_type) {
    case "gplus_code":
      this.state.isLoggingInWithGoogle = true;
      break;
    case "facebook_access_token":
      this.state.isLoggingInWithFacebook = true;
      break;
    }

    // Reset errors so UI won't display them when re-starting the login process
    this.state.googleLoginError = null;
    this.state.facebookLoginError = null;
    this.state.loginError = null;

    this.emit("change");
  },

  handleLoginSuccess({ user, new_signup }) {
    this.waitFor(["users", "UsersStore"], () => {
      this.state.loggedUsername = user.username;
      this.state.loggedUserId = user.id;

      this.state.isVerifyingEmail = false;
      this.state.isLoggingIn = false;
      this.state.isLoggingInWithGoogle = false;
      this.state.isLoggingInWithFacebook = false;
      this.state.isNewSignup = new_signup;

      this.emit("change");

      // Used for pusher, however stores should not emit events other than `change`.
      this.emit("login");

    });
  },

  handleLoginFailure({ data, error }) {
    this.state.isLoggingIn = false;
    this.state.isLoggingInWithGoogle = false;
    this.state.isLoggingInWithFacebook = false;

    switch (data.grant_type) {
    case "gplus_code":
      this.state.googleLoginError = error.body;
      break;
    case "facebook_access_token":
      this.state.facebookLoginError = error.body;
      break;
    default:
      this.state.loginError = error.body;
    }

    this.emit("change");
  },

  handleSignupStart() {
    this.state.isSigningUp = true;
    // Reset error so UI won't display it when re-starting the signup process
    this.state.signupError = null;
    this.emit("change");
  },

  handleSignupSuccess({ user }) {
    this.waitFor(["users", "UsersStore"], () => {
      this.state.isSigningUp = false;
      this.state.loggedUsername = user.username;
      this.state.loggedUserId = user.id;
      this.state.isNewSignup = true;
      this.emit("change");
      this.emit("login");
    });
  },

  handleSignupFailure({ error }) {
    this.state.isSigningUp = false;
    this.state.signupError = error.body;
    this.emit("change");
  },

  handleResetErrors() {
    this.state.loginError = null;
    this.state.facebookLoginError = null;
    this.state.googleLoginError = null;
    this.state.signupError = null;
    this.state.emailVerificationError = null;
    this.state.passwordResetError = null;
    this.emit("change");
  },

  handleLogout() {
    this.waitFor(["users"], () => {
      this.state = { ...defaultState };
      this.emit("change");
      // Used for pusher, however stores should not emit events other than `change`.
      this.emit("logout");
    });
  },

  handleEmailVerificationStart() {
    this.state.emailVerificationError = null;
    this.state.isVerifyingEmail = true;
    this.emit("change");
  },

  handleEmailVerificationFailure({ error }) {
    this.state.isVerifyingEmail = false;
    this.state.emailVerificationError = error;
    this.emit("change");
  },

  handlePasswordResetStart() {
    this.state.isRequestingPasswordReset = true;
    this.emit("change");
  },

  handlePasswordResetSuccess() {
    this.state.isRequestingPasswordReset = false;
    this.emit("change");
  },

  handlePasswordResetFailure({ error }) {
    this.state.isRequestingPasswordReset = false;
    this.state.passwordResetError = error.body;
    this.emit("change");
  },

  serialize() {
    return JSON.stringify(this.getState());
  },

  hydrate(json) {
    this.state = JSON.parse(json);
  }

});
