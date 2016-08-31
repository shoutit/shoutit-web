import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';
import { denormalize } from '../../schemas';
import { getPagination } from '../paginated';

export default createPaginatedReducer({
  mapActionToKey: action => action.payload.conversation.id,
  mapActionToTempId: action => action.payload.message.id,
  fetchTypes: [
    actionTypes.LOAD_MESSAGES_START,
    actionTypes.LOAD_MESSAGES_SUCCESS,
    actionTypes.LOAD_MESSAGES_FAILURE,
  ],
  createTypes: [
    actionTypes.CONVERSATION_REPLY_START,
    actionTypes.CONVERSATION_REPLY_SUCCESS,
  ],
  addType: actionTypes.ADD_NEW_MESSAGE,
});

export function getMessageReadBy(state, message) {
  if (!message.readBy) {
    return [];
  }
  return message.readBy
    .filter(readBy =>
      message.profile && readBy.profileId !== message.profile.id && readBy.profileId !== state.session.profile && state.entities.users[readBy.profileId]
    )
    .map(readBy => ({
      ...readBy,
      profile: state.entities.users[readBy.profileId],
    }));
}

export function getMessagesByConversation(state, id) {
  const paginated = state.paginated.messagesByConversation[id];
  if (!paginated || !paginated.ids) {
    return undefined;
  }
  return denormalize(paginated.ids, state.entities, 'MESSAGES')
    .sort((a, b) => a.createdAt - b.createdAt)
    .map(message => ({
      ...message,
      readBy: getMessageReadBy(state, message),
    }));
}

export function getPaginationState(state, id) {
  return getPagination(state, ['messagesByConversation', id]);
}
