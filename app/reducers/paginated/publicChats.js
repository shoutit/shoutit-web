import union from 'lodash/union';

import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';
import { denormalize } from '../../schemas';
import { getPagination } from '../paginated';

const paginated = createPaginatedReducer({
  mapActionToTempId: action => action.payload.conversation.id,
  fetchTypes: [
    actionTypes.PUBLIC_CHATS_LOAD_START,
    actionTypes.PUBLIC_CHATS_LOAD_SUCCESS,
    actionTypes.PUBLIC_CHATS_LOAD_FAILURE,
  ],
  // createTypes: [
  //   actionTypes.CONVERSATION_CREATE_START,
  //   actionTypes.CONVERSATION_CREATE_SUCCESS,
  // ],
  // deleteType: actionTypes.CONVERSATION_LEAVE_START,
});

export default function publicChats(state, action) {
  let newState = paginated(state, action);
  switch (action.type) {
    case actionTypes.CURRENTLOCATION_UPDATE_SUCCESS:
      return {
        ids: [],
      };
    case actionTypes.CONVERSATION_LOAD_SUCCESS:
      const conversation = action.payload.entities.conversations[action.payload.result];
      if (conversation.type === 'public_chat') {
        newState = {
          ...newState,
          ids: union(newState.ids, [action.payload.result]),
        };
      }
      break;

    default:
      break;
  }
  return newState;
}

export function getPublicChats(state) {
  return state.paginated.publicChats.ids.map(id =>
    denormalize(state.entities.conversations[id], state.entities, 'CONVERSATION')
  ).sort((a, b) => b.modifiedAt - a.modifiedAt);
}

export const getPaginationState = state => getPagination(state, 'publicChats');
