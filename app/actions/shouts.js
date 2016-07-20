import { now } from 'unix-timestamp';

import * as actionTypes from './actionTypes';
import { SHOUT, SHOUTS, CONVERSATION } from '../schemas';

export const loadShout = id => ({
  types: [
    actionTypes.LOAD_SHOUT_START,
    actionTypes.LOAD_SHOUT_SUCCESS,
    actionTypes.LOAD_SHOUT_FAILURE,
  ],
  payload: { id },
  service: {
    name: 'shout',
    params: { id },
    schema: SHOUT,
  },
});


export const loadShouts = query => {
  return {
    types: [
      actionTypes.LOAD_SHOUTS_START,
      actionTypes.LOAD_SHOUTS_SUCCESS,
      actionTypes.LOAD_SHOUTS_FAILURE,
    ],
    service: {
      name: 'shouts',
      schema: SHOUTS,
      params: query,
    },
    payload: { query },
  };

};

export const loadShoutSamples = () => {
  return {
    types: [
      actionTypes.LOAD_SHOUT_SAMPLES_START,
      actionTypes.LOAD_SHOUT_SAMPLES_SUCCESS,
      actionTypes.LOAD_SHOUT_SAMPLES_FAILURE,
    ],
    service: {
      name: 'shoutSamples',
      schema: SHOUTS,
    },
  };

};

export const loadRelatedShouts = (shoutId, query, endpoint) => ({
  types: [
    actionTypes.LOAD_RELATED_SHOUTS_START,
    actionTypes.LOAD_RELATED_SHOUTS_SUCCESS,
    actionTypes.LOAD_RELATED_SHOUTS_FAILURE,
  ],
  payload: { shoutId, endpoint },
  service: {
    name: 'relatedShouts',
    params: { shoutId },
    schema: SHOUTS,
  },
});

export const createShout = (user, newShout) => {
  const shout = {
    ...newShout,
    createdAt: now(),
  };
  return {
    types: [
      actionTypes.CREATE_SHOUT_START,
      actionTypes.CREATE_SHOUT_SUCCESS,
      actionTypes.CREATE_SHOUT_FAILURE,
    ],
    payload: { shout, username: user.username },
    service: {
      method: 'create',
      name: 'shout',
      body: shout,
      schema: SHOUT,
    },
  };
};

export const updateShout = (shout, removedImages) => ({
  types: [
    actionTypes.UPDATE_SHOUT_START,
    actionTypes.UPDATE_SHOUT_SUCCESS,
    actionTypes.UPDATE_SHOUT_FAILURE,
  ],
  payload: { shout, removedImages },
  service: {
    method: 'update',
    name: 'shout',
    params: { id: shout.id },
    body: { shout, removedImages },
    schema: SHOUT,
  },
});

export const deleteShout = shout => ({
  types: [
    actionTypes.DELETE_SHOUT_START,
    actionTypes.DELETE_SHOUT_SUCCESS,
    actionTypes.DELETE_SHOUT_FAILURE,
  ],
  payload: { shout },
  service: {
    method: 'delete',
    name: 'shout',
    params: { shout },
    body: shout,
    schema: SHOUT,
  },
});

export function saveShoutDraft(draft) {
  return {
    type: actionTypes.SAVE_SHOUT_DRAFT,
    payload: draft,
  };
}

export function resetShoutDraft() {
  return {
    type: actionTypes.RESET_SHOUT_DRAFT,
  };
}

export const call = id => ({
  types: [
    actionTypes.CALL_SHOUT_START,
    actionTypes.CALL_SHOUT_SUCCESS,
    actionTypes.CALL_SHOUT_FAILURE,
  ],
  payload: { id },
  service: {
    name: 'shoutCall',
    params: { id },
  },
});


export const startShoutReply = (loggedUser, shout) => {
  const conversation = {
    id: `shout-reply-${shout.id}`,
    isNew: true,
    type: 'about_shout',
    about: shout.id,
    display: {
      title: shout.title,
    },
    profiles: [
      shout.profile.id,
    ],
  };
  return {
    type: actionTypes.OPEN_CONVERSATION,
    payload: {
      conversation,
      entities: {
        conversations: {
          [conversation.id]: conversation,
        },
      },
    },
  };
};

export const replyToShout = (conversation, text) => {
  const { about: shout } = conversation;
  return {
    types: [
      actionTypes.CREATE_CONVERSATION_START,
      actionTypes.CREATE_CONVERSATION_SUCCESS,
      actionTypes.CREATE_CONVERSATION_FAILURE,
    ],
    payload: {
      conversation,
    },
    service: {
      name: 'shoutReply',
      method: 'create',
      params: { id: shout.id },
      body: { text },
      schema: CONVERSATION,
    },
  };
};
