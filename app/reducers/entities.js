import merge from "lodash/object/merge";
import * as actionTypes from "../actions/actionTypes";

const initialState = {
  currencies: {},
  categories: {},
  users: {},
  tags: {},
  shouts: {}
};

export default function(state=initialState, action) {
  if (action.payload && action.payload.entities) {
    return merge({}, state, action.payload.entities);
  }

  switch (action.types) {
  case actionTypes.LOGIN_SUCCESS:
    const loggedUser = action.payload;
    return merge({}, state, { users: { [loggedUser.id]: loggedUser }});
  default:
    return state;
  }

}
