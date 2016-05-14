import merge from 'lodash/merge';

import createEntityReducer from './createEntityReducer';
import * as actionTypes from '../../actions/actionTypes';

export default (state, action) => {

  state = createEntityReducer({
    name: 'conversations',
    mapActionToTempId: action => action.payload.conversation.id,
    mapActionToTempEntity: action => action.payload.conversation,
    createTypes: [
      actionTypes.CREATE_CONVERSATION_START,
      actionTypes.CREATE_CONVERSATION_SUCCESS,
      actionTypes.CREATE_CONVERSATION_FAILURE,
    ],
  })(state, action);

  const { type, payload } = action;

  switch (type) {
    case actionTypes.READ_CONVERSATION_START:
      state = merge({}, state, {
        [payload.conversation.id]: { unreadMessagesCount: 0 },
      });
      break;
    case actionTypes.UNREAD_CONVERSATION_START:
      state = merge({}, state, {
        [payload.conversation.id]: { unreadMessagesCount: 1 },
      });
      break;
    case actionTypes.REPLY_CONVERSATION_SUCCESS:
      state = merge({}, state, {
        [payload.conversation.id]: {
          lastMessage: payload.result,
          modifiedAt: payload.entities.messages[payload.result].createdAt,
        },
      });
  }
  return state;
};
