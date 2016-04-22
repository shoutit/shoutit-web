import * as actionTypes from '../actions/actionTypes';
import paginate from './paginate';

export default paginate({
  mapActionToTempId: action => action.payload.conversation.id,
  fetchTypes: [
    actionTypes.LOAD_CONVERSATIONS_START,
    actionTypes.LOAD_CONVERSATIONS_SUCCESS,
    actionTypes.LOAD_CONVERSATIONS_FAILURE,
  ],
  createTypes: [
    actionTypes.CREATE_CONVERSATION_START,
    actionTypes.CREATE_CONVERSATION_SUCCESS,
  ],
  addType: actionTypes.LOAD_CONVERSATION_SUCCESS,
  deleteType: actionTypes.LEAVE_CONVERSATION_START,
});
