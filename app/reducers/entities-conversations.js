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
  switch (action.type) {
  case actionTypes.SET_CURRENT_CONVERSATION:
    return merge({}, state, {
      [action.payload]: {
        unreadMessagesCount: 0
      }
    });
  }
  return state;
}
