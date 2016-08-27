import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';
import { denormalize } from '../../schemas';
import { getPagination } from '../paginated';

export default createPaginatedReducer({
  mapActionToTempId: action => action.payload.conversation.id,
  fetchTypes: [
    actionTypes.CHAT_LOAD_START,
    actionTypes.CHAT_LOAD_SUCCESS,
    actionTypes.CHAT_LOAD_FAILURE,
  ],
  createTypes: [
    actionTypes.CREATE_CONVERSATION_START,
    actionTypes.CREATE_CONVERSATION_SUCCESS,
  ],
  addType: actionTypes.LOAD_CONVERSATION_SUCCESS,
  deleteType: actionTypes.LEAVE_CONVERSATION_START,
});


export function getAllConversations(state) {
  return state.paginated.chatConversations.ids.map(id =>
    denormalize(state.entities.conversations[id], state.entities, 'CONVERSATION')
  ).sort((a, b) => b.modifiedAt - a.modifiedAt);
}

export const getPaginationState = state => getPagination(state, 'chatConversations');
