import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';
import { denormalize } from '../../schemas';
import { getState } from '../paginated';

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

export function getMessageReadBy(state, message) {
  if (!message.readBy) {
    return [];
  }
  return message.readBy
    .filter(readBy =>
      message.profile && readBy.profileId !== message.profile.id && readBy.profileId !== state.session.user && state.entities.users[readBy.profileId]
    )
    .map(readBy => {
      return {
        ...readBy,
        profile: state.entities.users[readBy.profileId],
      };
    });
}

export function getMessagesByConversation(state, id) {
  const paginated = state.paginated.messagesByConversation[id];
  if (!paginated) {
    return [];
  }
  const messages = paginated.ids
  .map(id =>
    denormalize(state.entities.messages[id], state.entities, 'MESSAGE')
  )
  .sort((a, b) => a.createdAt - b.createdAt)
  .map(message => ({
    ...message,
    readBy: getMessageReadBy(state, message),
  }));
  return messages;
}

export const getPaginationState = (state, id) =>
  getState(state, `messagesByConversation.${id}`);
