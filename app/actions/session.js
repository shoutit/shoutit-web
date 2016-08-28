import set from 'lodash/set';

import * as actionTypes from './actionTypes';
import { getMixpanelId } from '../utils/mixpanel';

import { PROFILE, EMAIL_VERIFICATION } from '../schemas';
import * as grantTypes from '../constants/grantTypes';

export function login({ grant_type = grantTypes.shoutit_login, ...loginData }) {
  const body = {
    ...loginData,
    grant_type,
    mixpanel_distinct_id: getMixpanelId(),
  };
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
      schema: PROFILE,
    },
  };
}

export function signup(account) {
  const body = Object.assign({}, {
    ...account,
    mixpanel_distinct_id: getMixpanelId(),
  });

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
      schema: PROFILE,
    },
  };
}

export function clientLogin(user) {
  const payload = set({}, `entities.users.${user.id}`, user);
  set(payload, 'result', user.id);
  return {
    type: actionTypes.LOGIN_SUCCESS,
    payload,
  };
}

export function loginWithGoogle(gplusCode) {
  const loginData = {
    gplus_code: gplusCode,
    grant_type: grantTypes.gplus_code,
  };
  return login(loginData);
}

export function loginWithFacebook(accessToken) {
  const loginData = {
    facebook_access_token: accessToken,
    grant_type: grantTypes.facebook_access_token,
  };
  return login(loginData);
}

export function loginWithAuthToken(authToken) {
  const loginData = {
    auth_token: authToken,
    grant_type: grantTypes.auth_token,
  };
  return login(loginData);
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


export function resetPassword(email) {
  return {
    types: [
      actionTypes.PASSWORD_RESET_START,
      actionTypes.PASSWORD_RESET_SUCCESS,
      actionTypes.PASSWORD_RESET_FAILURE,
    ],
    service: {
      name: 'resetPassword',
      method: 'create',
      body: { email },
    },
  };
}

export function setPassword(newPassword, resetToken) {
  return {
    types: [
      actionTypes.PASSWORD_SET_START,
      actionTypes.PASSWORD_SET_SUCCESS,
      actionTypes.PASSWORD_SET_FAILURE,
    ],
    service: {
      name: 'setPassword',
      method: 'create',
      body: { newPassword, resetToken },
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
      actionTypes.VERIFY_EMAIL_START,
      actionTypes.VERIFY_EMAIL_SUCCESS,
      actionTypes.VERIFY_EMAIL_FAILURE,
    ],
    service: {
      name: 'emailVerification',
      params: { token },
      schema: EMAIL_VERIFICATION,
    },
  };
}

export function resetErrors() {
  return {
    type: actionTypes.RESET_SESSION_ERRORS,
  };
}

export function updateLinkedAccount(body) {
  return {
    types: [
      actionTypes.UPDATE_LINKED_ACCOUNT_START,
      actionTypes.UPDATE_LINKED_ACCOUNT_SUCCESS,
      actionTypes.UPDATE_LINKED_ACCOUNT_FAILURE,
    ],
    service: {
      name: 'profileLink',
      method: 'update',
      body,
    },
  };
}

export function authenticateAs(profile) {
  return {
    types: [
      actionTypes.SESSION_AUTHENTICATE_AS_START,
      actionTypes.SESSION_AUTHENTICATE_AS_SUCCESS,
      actionTypes.SESSION_AUTHENTICATE_AS_FAILURE,
    ],
    service: {
      name: 'authenticateAs',
      method: 'create',
      body: {
        id: profile.id,
        username: profile.username,
      },
    },
  };
}
