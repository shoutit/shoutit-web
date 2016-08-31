import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';
import { denormalize } from '../../schemas';
import { getPagination } from '../paginated';

export default createPaginatedReducer({
  mapActionToTempId: action => action.payload.conversation.id,
  fetchTypes: [
    actionTypes.PUBLIC_CHATS_LOAD_START,
    actionTypes.PUBLIC_CHATS_LOAD_SUCCESS,
    actionTypes.PUBLIC_CHATS_LOAD_FAILURE,
  ],
  createTypes: [
    actionTypes.CONVERSATION_CREATE_START,
    actionTypes.CONVERSATION_CREATE_SUCCESS,
  ],
  addType: actionTypes.CONVERSATION_LOAD_SUCCESS,
  deleteType: actionTypes.CONVERSATION_LEAVE_START,
});


export function getPublicChats(state) {
  return state.paginated.publicChats.ids.map(id =>
    denormalize(state.entities.conversations[id], state.entities, 'CONVERSATION')
  ).sort((a, b) => b.modifiedAt - a.modifiedAt);
}

export const getPaginationState = state => getPagination(state, 'publicChats');
