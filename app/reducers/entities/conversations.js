import merge from 'lodash/merge';
import { denormalize } from '../../schemas';
import createEntityReducer from './createEntityReducer';
import * as actionTypes from '../../actions/actionTypes';

export default (state, action) => {

  state = createEntityReducer({
    name: 'conversations',
    mapActionToTempId: action => action.payload.conversation.id,
    mapActionToTempEntity: action => action.payload.conversation,
    createTypes: [
      actionTypes.CONVERSATION_CREATE_START,
      actionTypes.CONVERSATION_CREATE_SUCCESS,
      actionTypes.CONVERSATION_CREATE_FAILURE,
    ],
  })(state, action);

  const { type, payload } = action;

  switch (type) {
    case actionTypes.READ_MESSAGE_START:
      state = merge({}, state, {
        [payload.message.conversationId]: {
          unreadMessagesCount: state[payload.message.conversationId].unreadMessagesCount - 1,
        },
      });
      break;
    case actionTypes.CONVERSATION_READ_START:
    case actionTypes.CONVERSATION_MARK_READ:
      state = merge({}, state, {
        [payload.conversation.id]: { unreadMessagesCount: 0 },
      });
      break;
    case actionTypes.CONVERSATION_MARK_UNREAD_START:
      state = merge({}, state, {
        [payload.conversation.id]: { unreadMessagesCount: 1 },
      });
      break;
    case actionTypes.CONVERSATION_BEGIN:
      state = merge({}, state, {
        [payload.conversation.id]: payload.conversation,
      });
      break;
    case actionTypes.CONVERSATION_REPLY_SUCCESS:
      state = merge({}, state, {
        [payload.conversation.id]: {
          display: {
            lastMessageSummary: payload.entities.messages[payload.result].text,
          },
          lastMessage: payload.result,
          modifiedAt: payload.entities.messages[payload.result].createdAt,
        },
      });
      break;
    case actionTypes.ADD_NEW_MESSAGE:
      const { conversationId, createdAt, id, text } = payload.message;
      if (state[conversationId]) {
        // check if conversation exists as payload may have not beene loaded yet
        state = merge({}, state, {
          [conversationId]: {
            display: {
              lastMessageSummary: text,
            },
            lastMessage: id,
            modifiedAt: createdAt,
            messagesCount: state[conversationId].messagesCount + 1,
            unreadMessagesCount: state[conversationId].unreadMessagesCount + 1,
          },
        });
      }

  }
  return state;
};

export function getConversation(state, id) {
  return denormalize(state.entities.conversations[id], state.entities, 'CONVERSATION');
}

