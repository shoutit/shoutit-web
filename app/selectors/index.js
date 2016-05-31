import omit from 'lodash/omit';
import get from 'lodash/get';
import findLast from 'lodash/findLast';

import { denormalize } from '../schemas';

export function getLoggedUser(state) {
  return denormalize(state.entities.users[state.session.user], state.entities, 'PROFILE');
}

// Misc selector

export function getPaginationState(state, selector) {
  return omit(get(state.paginated, selector), 'ids');
}

// Shouts selectors

export function getShoutsByUsername(state, username) {
  const paginated = state.paginated.shoutsByUsername[username];
  if (!paginated) {
    return [];
  }
  return paginated.ids.map(id =>
    denormalize(state.entities.shouts[id], state.entities, 'SHOUT')
  );
}

export function getHomepageShouts(state) {
  return state.paginated.shoutsByHome.ids.map(
    id => denormalize(state.entities.shouts[id], state.entities, 'SHOUT')
  );
}

// Chat selectors
export function getConversation(state, id) {
  return denormalize(state.entities.conversations[id], state.entities, 'CONVERSATION');
}

export function getAllConversations(state) {
  return state.paginated.chatConversations.ids.map(id =>
    denormalize(state.entities.conversations[id], state.entities, 'CONVERSATION')
  ).sort((a, b) => b.modifiedAt - a.modifiedAt);
}

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

export function getTypingProfiles(state, conversationId) {
  if (!state.chat.typingProfiles[conversationId]) {
    return [];
  }
  return state.chat.typingProfiles[conversationId].map(id => state.entities.users[id]);
}
