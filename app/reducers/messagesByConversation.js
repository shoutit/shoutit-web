import * as actionTypes from '../actions/actionTypes';
import paginate from './paginate';

export default paginate({
  mapActionToKey: action => action.payload.conversationId,
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
  addType: actionTypes.ADD_MESSAGE,
});
