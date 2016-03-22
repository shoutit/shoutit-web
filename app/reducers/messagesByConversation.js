
import * as actionTypes from "../actions/actionTypes";
import union from "lodash/array/union";

export default function(state={}, action) {
  const { type, payload } = action;

  switch (type) {
  case actionTypes.LOAD_MESSAGES_START:
    return {
      ...state,
      [payload.conversationId]: {
        isFetching: true,
        ids: state[payload.conversationId] ? state[payload.conversationId].ids : []
      }
    };

  case actionTypes.LOAD_MESSAGES_SUCCESS:
    const { result, nextUrl, previousUrl } = action.payload;
    return {
      ...state,
      [payload.conversationId]: {
        ids: union(result, state[payload.conversationId].ids),
        nextUrl,
        previousUrl
      }
    };

  case actionTypes.LOAD_MESSAGES_FAILURE:
    return {
      ...state,
      [payload.conversationId]: {
        isFetching: false,
        error: payload,
        ids: state[payload.conversationId] ? state[payload.conversationId].ids : []
      }
    };

  case actionTypes.ADD_NEW_MESSAGE:
    const { conversationId } = payload;
    const conversation = {
      ...state[conversationId],
      ids: payload.result
    };
    return {
      ...state,
      [conversationId]: conversation
    };

  default:
    return state;
  }
}
