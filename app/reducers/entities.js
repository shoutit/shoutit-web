import merge from "lodash/object/merge";
import * as actionTypes from "../actions/actionTypes";

const initialState = {
  categories: {},
  conversations: {},
  currencies: {},
  messages: {},
  shouts: {},
  tags: {},
  users: {}
};

export default function(state=initialState, action) {
  if (action.payload && action.payload.entities) {
    return merge({}, state, action.payload.entities);
  }

  switch (action.type) {
  case actionTypes.LOGIN_SUCCESS:
    const loggedUser = action.payload;
    return merge({}, state, { users: { [loggedUser.id]: loggedUser }});

  case actionTypes.LOGOUT:

    // Cleanup state only for logged in user
    return {
      ...state,
      conversations: {},
      messages: {}
    };

  default:
    return state;
  }

}
