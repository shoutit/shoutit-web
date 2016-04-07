import * as actionTypes from './actionTypes';

export function createSession({ grant_type = 'shoutit_login', ...loginData }) {
  const body = { ...loginData, grant_type };
  return {
    payload: { grant_type },
    types: [
      actionTypes.LOGIN_START,
      actionTypes.LOGIN_SUCCESS,
      actionTypes.LOGIN_FAILURE,
    ],
    service: {
      name: 'session',
      method: 'create',
      body,
    },
  };
}

export function loginWithGoogle({ gplus_code, user }) {
  const loginData = { gplus_code, user, grant_type: 'gplus_code' };
  return createSession(loginData);
}

export function loginWithFacebook({ facebook_access_token, user }) {
  const loginData = { facebook_access_token, user, grant_type: 'facebook_access_token' };
  return createSession(loginData);
}

export function logout() {
  return {
    types: [
      actionTypes.LOGOUT,
      actionTypes.LOGOUT_SUCCESS,
      actionTypes.LOGOUT_FAILURE,
    ],
    service: {
      name: 'session',
      method: 'delete',
    },
  };
}

export function login(user) {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    payload: user,
  };
}

export function createProfile(body) {
  return {
    types: [
      actionTypes.SIGNUP_START,
      actionTypes.SIGNUP_SUCCESS,
      actionTypes.SIGNUP_FAILURE,
    ],
    service: {
      name: 'profile',
      method: 'create',
      body,
    },
  };
}

export function requestPasswordReset(email) {
  return {
    types: [
      actionTypes.PASSWORD_RESET_START,
      actionTypes.PASSWORD_RESET_SUCCESS,
      actionTypes.PASSWORD_RESET_FAILURE,
    ],
    service: {
      name: 'passwordReset',
      method: 'create',
      body: { email },
    },
  };
}

export function sendEmailVerification(email) {
  return {
    types: [
      actionTypes.SEND_EMAIL_VERIFICATION_START,
      actionTypes.SEND_EMAIL_VERIFICATION_SUCCESS,
      actionTypes.SEND_EMAIL_VERIFICATION_FAILURE,
    ],
    service: {
      name: 'emailVerification',
      method: 'create',
      params: { email },
    },
  };
}

export function verifyEmail(token) {
  return {
    types: [
      actionTypes.EMAIL_VERIFICATION_START,
      actionTypes.EMAIL_VERIFICATION_SUCCESS,
      actionTypes.EMAIL_VERIFICATION_FAILURE,
    ],
    service: {
      name: 'emailVerification',
      params: { token },
    },
  };
}

export function resetSessionErrors() {
  return {
    type: actionTypes.RESET_SESSION_ERRORS,
  };
}
