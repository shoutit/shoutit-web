import merge from 'lodash/merge';
import without from 'lodash/without';
import union from 'lodash/union';

import * as actionTypes from '../actions/actionTypes';

const initialState = {
  openedConversations: [],
  activeConversations: [],
  typingProfiles: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.CONVERSATION_SET_ACTIVE:
      return merge({}, state, {
        activeConversations: union(state.activeConversations, [payload.id]),
      });
    case actionTypes.CONVERSATION_UNSET_ACTIVE:
      return Object.assign({}, state, {
        activeConversations: without(state.activeConversations, payload.id),
      });
    case actionTypes.CHAT_RECEIVE_TYPING_NOTIFICATION:
      if (state.typingProfiles[payload.conversationId] &&
        state.typingProfiles[payload.conversationId].indexOf(payload.userId) > -1) {
        // ignore if already typing
        return state;
      }
      return merge({}, state, {
        typingProfiles: {
          [payload.conversationId]: [payload.userId],
        },
      });

    case actionTypes.CHAT_STOP_TYPING:
      const newState = {
        ...state,
        typingProfiles: {
          ...state.typingProfiles,
          [payload.conversationId]: without(state.typingProfiles[payload.conversationId], payload.userId),
        },
      };
      return newState;

    case actionTypes.CONVERSATION_BEGIN:
    case actionTypes.CONVERSATION_OPEN:
      return {
        ...state,
        openedConversations: union(state.openedConversations, [payload.conversation.id]),
      };
    case actionTypes.CONVERSATION_LEAVE_START:
    case actionTypes.CONVERSATION_CLOSE:
      return {
        ...state,
        openedConversations: without(state.openedConversations, payload.id),
      };
    default: return state;
  }
}

export function getTypingProfiles(state, conversationId) {
  if (!state.chat.typingProfiles[conversationId]) {
    return [];
  }
  return state.chat.typingProfiles[conversationId].map(id => state.entities.users[id]);
}
