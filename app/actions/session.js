import * as actionTypes from "./actionTypes";

export function getCurrentSession() {
  return {
    service: {
      name: "session",
      types: [
        actionTypes.GET_SESSION_START,
        actionTypes.GET_SESSION_SUCCESS,
        actionTypes.GET_SESSION_FAILURE
      ]
    }
  };
}

export function loginWithGoogle({ gplus_code, user }) {
  const loginData = { gplus_code, user, grant_type: "gplus_code" };
  return createSession(loginData);
}

export function loginWithFacebook({ facebook_access_token, user }) {
  const loginData = { facebook_access_token, user, grant_type: "facebook_access_token" };
  return createSession(loginData);
}

export function createSession({ grant_type="shoutit_login", ...loginData}) {
  const body = { ...loginData, grant_type };
  return {
    payload: { grant_type },
    service: {
      name: "session",
      method: "create",
      body: body,
      types: [
        actionTypes.LOGIN_START,
        actionTypes.LOGIN_SUCCESS,
        actionTypes.LOGIN_FAILURE
      ]
    }
  };
}

export function logout() {
  return {
    service: {
      name: "session",
      method: "delete",
      types: [
        actionTypes.LOGOUT_START,
        actionTypes.LOGOUT_SUCCESS,
        actionTypes.LOGOUT_FAILURE
      ]
    }
  };
}

export function login(user) {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    payload: user
  };
}

export function createProfile(body) {
  return {
    service: {
      name: "profile",
      method: "create",
      body,
      types: [
        actionTypes.SIGNUP_START,
        actionTypes.SIGNUP_SUCCESS,
        actionTypes.SIGNUP_FAILURE
      ]
    }
  };
}

export function requestPasswordReset(email) {
  return {
    service: {
      name: "passwordReset",
      method: "create",
      body: { email },
      types: [
        actionTypes.PASSWORD_RESET_START,
        actionTypes.PASSWORD_RESET_SUCCESS,
        actionTypes.PASSWORD_RESET_FAILURE
      ]
    }
  };
}

export function sendEmailVerification(email) {
  return {
    service: {
      name: "emailVerification",
      method: "create",
      params: { email },
      types: [
        actionTypes.SEND_EMAIL_VERIFICATION_START,
        actionTypes.SEND_EMAIL_VERIFICATION_SUCCESS,
        actionTypes.SEND_EMAIL_VERIFICATION_FAILURE
      ]
    }
  };
}

export function verifyEmail(token) {
  return {
    service: {
      name: "emailVerification",
      params: { token },
      types: [
        actionTypes.EMAIL_VERIFICATION_START,
        actionTypes.EMAIL_VERIFICATION_SUCCESS,
        actionTypes.EMAIL_VERIFICATION_FAILURE
      ]
    }
  };
}
