import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';
import { denormalize } from '../../schemas';
import { getPagination } from '../paginated';

export default createPaginatedReducer({
  mapActionToTempId: action => action.payload.conversation.id,
  fetchTypes: [
    actionTypes.CONVERSATIONS_LOAD_START,
    actionTypes.CONVERSATIONS_LOAD_SUCCESS,
    actionTypes.CONVERSATIONS_LOAD_FAILURE,
  ],
  createTypes: [
    actionTypes.CONVERSATION_CREATE_START,
    actionTypes.CONVERSATION_CREATE_SUCCESS,
  ],
  addType: actionTypes.CONVERSATION_LOAD_SUCCESS,
  deleteType: actionTypes.CONVERSATION_LEAVE_START,
});


export function getAllConversations(state) {
  return state.paginated.chatConversations.ids.map(id =>
    denormalize(state.entities.conversations[id], state.entities, 'CONVERSATION')
  ).sort((a, b) => b.modifiedAt - a.modifiedAt);
}

export const getPaginationState = state => getPagination(state, 'chatConversations');
