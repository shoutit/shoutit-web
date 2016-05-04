import * as actionTypes from '../actions/actionTypes';

const initialState = {

  isSigningUp: false,
  isLoggingIn: false,

  loginError: false,
  signupError: false,

  isVerifyingEmail: false,
  verifyEmailError: null,

  isNewSignup: false,

  isResettingPassword: false,
  resetPasswordError: null,

  user: null,

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
    case actionTypes.VERIFY_EMAIL_SUCCESS:
      return {
        ...state,
        user: payload.user.id,
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
    case actionTypes.SIGNUP_SUCCESS:
      return {
        ...state,
        user: payload.user,
        isSigningUp: false,
        isNewSignup: true,
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

    // case actionTypes.LOGOUT:
    //   return {
    //     ...state,
    //     user: null,
    //   };

    case actionTypes.RESET_SESSION_ERRORS:
      return {
        ...state,
        loginError: null,
        resetPasswordError: null,
        setPasswordError: null,
        verifyEmailError: null,
        signupError: null,
      };

    default: return state;

  }
}
