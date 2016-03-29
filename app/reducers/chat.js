import merge from "lodash/object/merge";
import without from "lodash/array/without";

import * as actionTypes from "../actions/actionTypes";

const initialState = {
  currentConversation: null,
  typingUsers: {}
};

export default function(state=initialState, action) {
  const { type, payload } = action;

  switch (type) {

  case actionTypes.SET_CURRENT_CONVERSATION:
    return {
      ... state,
      currentConversation: payload,
      typingUsers: {
        [payload]: []
      }
    };

  case actionTypes.TYPING_USER_NOTIFICATION:
    if (state.typingUsers[payload.conversationId].indexOf(payload.userId) > -1) {
      return state;
    }
    return merge({}, state, {
      typingUsers: {
        [payload.conversationId]: [...state.typingUsers[payload.conversationId], payload.userId]
      }
    });

  case actionTypes.REMOVE_TYPING_USER:
    const newState = {
      ...state,
      typingUsers: {
        ...state.typingUsers,
        [payload.conversationId]: without(state.typingUsers[payload.conversationId], payload.userId)
      }
    };
    return newState;

  default: return state;
  }
}
