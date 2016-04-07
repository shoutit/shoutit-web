import * as actionTypes from '../actions/actionTypes';

const initialState = {

  isSigningUp: false,
  isLoggingIn: false,

  loginError: false,
  signupError: false,

  isVerifyingEmail: false,
  emailVerificationError: null,

  isNewSignup: false,

  isRequestingPasswordReset: false,
  passwordResetError: null,

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
    case actionTypes.EMAIL_VERIFICATION_SUCCESS:
      return {
        ...state,
        user: payload,
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
        user: payload,
        isSigningUp: false,
        isNewSignup: true,
      };

    case actionTypes.SIGNUP_FAILURE:
      return {
        ...state,
        isSigningUp: false,
        signupError: payload.details,
      };

    case actionTypes.EMAIL_VERIFICATION_START:
      return {
        ...state,
        emailVerificationError: null,
        isVerifyingEmail: true,
      };

    case actionTypes.EMAIL_VERIFICATION_FAILURE:
      return {
        ...state,
        isVerifyingEmail: false,
        emailVerificationError: payload.details,
      };

    case actionTypes.PASSWORD_RESET_START:
      return {
        ...state,
        isRequestingPasswordReset: true,
      };

    case actionTypes.PASSWORD_RESET_SUCCESS:
      return {
        ...state,
        isRequestingPasswordReset: false,
      };

    case actionTypes.PASSWORD_RESET_FAILURE:
      return {
        ...state,
        isRequestingPasswordReset: false,
        passwordResetError: payload.details,
      };

    case actionTypes.LOGOUT:
      return {
        ...state,
        user: null,
      };

    case actionTypes.RESET_SESSION_ERRORS:
      return {
        ...state,
        loginError: null,
        passwordResetError: null,
        emailVerificationError: null,
        signupError: null,
      };

    default: return state;

  }
}
