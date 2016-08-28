import * as actionTypes from '../actions/actionTypes';
import { denormalize } from '../schemas';
import { isLinked, isScopeGranted } from '../utils/FacebookUtils';

const initialState = {

  isSigningUp: false,
  isLoggingIn: false,

  loginError: null,
  signupError: null,

  isVerifyingEmail: false,
  verifyEmailError: null,

  isNewSignup: false,

  isResettingPassword: false,
  resetPasswordError: null,

  isUpdatingPassword: false,
  updatePasswordError: null,

  profile: null, // the logged in profile
  page: null, // the authenticated page (if set from switch to page)

};

export default function (state = initialState, action) {
  const { payload, type } = action;
  switch (type) {

    case actionTypes.LOGIN_START:
      return {
        ...state,
        isLoggingIn: true,
        loginError: null,
      };

    case actionTypes.LOGIN_SUCCESS:
    case actionTypes.SIGNUP_SUCCESS:
      const { type } = payload.entities.users[payload.result].type;
      if (type === 'user') {
        type === 'profile';
      }
      return {
        ...state,
        [type]: payload.result,
        isVerifyingEmail: false,
        isLoggingIn: false,
      };

    case actionTypes.LOGIN_FAILURE:
      const { error: loginError } = payload;
      return {
        ...state,
        loginError,
        isLoggingIn: false,
      };

    case actionTypes.SIGNUP_START:
      return {
        ...state,
        isSigningUp: true,
        signupError: null,
      };
    case actionTypes.SIGNUP_FAILURE:
      return {
        ...state,
        isSigningUp: false,
        signupError: payload.error,
      };

    case actionTypes.VERIFY_EMAIL_START:
      return {
        ...state,
        verifyEmailError: null,
        isVerifyingEmail: true,
      };
    case actionTypes.VERIFY_EMAIL_SUCCESS:
      return {
        ...state,
        profile: payload.result.profile,
      };
    case actionTypes.VERIFY_EMAIL_FAILURE:
      return {
        ...state,
        isVerifyingEmail: false,
        verifyEmailError: payload.error,
      };

    case actionTypes.PASSWORD_RESET_START:
      return {
        ...state,
        resetPasswordError: null,
        isResettingPassword: true,
      };
    case actionTypes.PASSWORD_RESET_SUCCESS:
      return {
        ...state,
        isResettingPassword: false,
        resetPasswordError: null,
      };
    case actionTypes.PASSWORD_RESET_FAILURE:
      return {
        ...state,
        isResettingPassword: false,
        resetPasswordError: payload.error,
      };

    case actionTypes.PASSWORD_SET_START:
      return {
        ...state,
        isSettingPassword: true,
        setPasswordError: null,
      };
    case actionTypes.PASSWORD_SET_SUCCESS:
      return {
        ...state,
        isSettingPassword: false,
        setPasswordError: null,
      };
    case actionTypes.PASSWORD_SET_FAILURE:
      return {
        ...state,
        isSettingPassword: false,
        setPasswordError: payload.error,
      };

    case actionTypes.UPDATE_PASSWORD_START:
      return {
        ...state,
        updatePasswordError: null,
        isUpdatingPassword: true,
      };
    case actionTypes.UPDATE_PASSWORD_SUCCESS:
      return {
        ...state,
        isUpdatingPassword: false,
        updatePasswordError: null,
      };
    case actionTypes.UPDATE_PASSWORD_FAILURE:
      return {
        ...state,
        isUpdatingPassword: false,
        updatePasswordError: payload.error,
      };

    case actionTypes.RESET_SESSION_ERRORS:
      return {
        ...state,
        loginError: null,
        resetPasswordError: null,
        updatePasswordError: null,
        setPasswordError: null,
        verifyEmailError: null,
        signupError: null,
      };

    default: return state;

  }
}


/**
 * Return the current logged-in profile, or the page in behalf of the logged-in account.
 *
 * @export
 * @param {Object} state
 * @returns
 */
export function getLoggedProfile(state) {
  return denormalize(
    state.entities.users[state.session.page || state.session.profile],
    state.entities,
    'PROFILE'
  );
}

/**
 * Return the actual logged-in account, e.g. if authenticated as page, it will return the
 * account that authenticated with it.
 *
 * @export
 * @param {Object} state
 * @returns
 */
export function getLoggedAccount(state) {
  return denormalize(
    state.entities.users[state.session.profile],
    state.entities,
    'PROFILE'
  );
}

export function getUnreadNotificationsCount(state) {
  const loggedProfile = getLoggedProfile(state);
  if (!loggedProfile) {
    return 0;
  }
  return loggedProfile.stats.unreadNotificationsCount;
}


export function getUnreadConversationsCount(state) {
  const loggedProfile = getLoggedProfile(state);
  if (!loggedProfile) {
    return 0;
  }
  return loggedProfile.stats.unreadConversationsCount;
}

export function canPublishToFacebook(state) {
  const loggedProfile = getLoggedProfile(state);
  return isLinked(loggedProfile) &&
      isScopeGranted('publish_actions', loggedProfile.linkedAccounts.facebook.scopes);
}

export function isLoggedIn(state) {
  return !!getLoggedProfile(state);
}
