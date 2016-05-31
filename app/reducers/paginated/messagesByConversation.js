import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';

export default createPaginatedReducer({
  mapActionToKey: action => action.payload.conversation.id,
  mapActionToTempId: action => action.payload.message.id,
  fetchTypes: [
    actionTypes.LOAD_MESSAGES_START,
    actionTypes.LOAD_MESSAGES_SUCCESS,
    actionTypes.LOAD_MESSAGES_FAILURE,
  ],
  createTypes: [
    actionTypes.REPLY_CONVERSATION_START,
    actionTypes.REPLY_CONVERSATION_SUCCESS,
  ],
  addType: actionTypes.ADD_NEW_MESSAGE,
});
