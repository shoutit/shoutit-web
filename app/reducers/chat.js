import merge from 'lodash/merge';
import without from 'lodash/without';
import union from 'lodash/union';

import * as actionTypes from '../actions/actionTypes';

const initialState = {
  openedConversations: [],
  activeConversations: [],
  typingUsers: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.SET_ACTIVE_CONVERSATION:
      return merge({}, state, {
        activeConversations: union(state.activeConversations, [payload.id]),
      });
    case actionTypes.UNSET_ACTIVE_CONVERSATION:
      return Object.assign({}, state, {
        activeConversations: without(state.activeConversations, payload.id),
      });
    case actionTypes.RECEIVE_CLIENT_IS_TYPING:
      if (state.typingUsers[payload.conversationId] &&
        state.typingUsers[payload.conversationId].indexOf(payload.userId) > -1) {
        // ignore if already typing
        return state;
      }
      return merge({}, state, {
        typingUsers: {
          [payload.conversationId]: [payload.userId],
        },
      });

    case actionTypes.REMOVE_CLIENT_IS_TYPING:
      const newState = {
        ...state,
        typingUsers: {
          ...state.typingUsers,
          [payload.conversationId]: without(state.typingUsers[payload.conversationId], payload.userId),
        },
      };
      return newState;

    case actionTypes.START_CONVERSATION:
    case actionTypes.OPEN_CONVERSATION:
      return {
        ...state,
        openedConversations: union(state.openedConversations, [payload.conversation.id]),
      };
    case actionTypes.LEAVE_CONVERSATION_START:
    case actionTypes.CLOSE_CONVERSATION:
      return {
        ...state,
        openedConversations: without(state.openedConversations, payload.id),
      };
    default: return state;
  }
}
