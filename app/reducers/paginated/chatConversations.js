import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';
import { denormalize } from '../../schemas';
import { getState } from '../paginated';

export default createPaginatedReducer({
  mapActionToTempId: action => action.payload.conversation.id,
  fetchTypes: [
    actionTypes.LOAD_CHAT_START,
    actionTypes.LOAD_CHAT_SUCCESS,
    actionTypes.LOAD_CHAT_FAILURE,
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

export const getPaginationState = state => getState(state, 'chatConversations');
