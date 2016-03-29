import * as actionTypes from '../actions/actionTypes';

export default function (state = {}, action) {
  let user;

  switch (action.type) {
    case actionTypes.LOGIN_SUCCESS:
      user = action.payload;
      return {
        ...state,
        [user.id]: user,
      };
    default: return state;

  }

}
