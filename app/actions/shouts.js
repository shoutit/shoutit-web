import omit from 'lodash/omit';
import omitBy from 'lodash/omitBy';
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


export const loadShouts = (params) => {

  const { page, page_size, sort, within, free, ...query } = params;

  if (query.hasOwnProperty('location')) {
    query.location.postal_code = query.location.postalCode;

    query.location = omitBy(query.location, i => !i);
    const keys = ['slug', 'name', 'postalCode'];
    if (within) {
      keys.append(['latitude', 'longitude', 'postal_code', 'address', 'city']);
      if (within === 'state') {
        keys.push(['state']);
      }
    }
    query.location = omit(query.location, keys);
  }

  if (query.hasOwnProperty('filters')) {
    Object.keys(query.filters).forEach(slug => {
      query[slug] = query.filters[slug];
    });
    delete query.filters;
  }

  if (free) {
    delete query.min_price;
    query.max_price = 0;
  }

  const pagination = { page, page_size, sort };

  return {
    types: [
      actionTypes.LOAD_SHOUTS_START,
      actionTypes.LOAD_SHOUTS_SUCCESS,
      actionTypes.LOAD_SHOUTS_FAILURE,
    ],
    service: {
      name: 'shouts',
      schema: SHOUTS,
      params: {
        ...query,
        ...pagination,
      },
    },
    payload: {
      query,
      pagination,
    },
  };

};

export const invalidateShouts = (searchParams) => ({
  type: actionTypes.INVALIDATE_SHOUTS,
  payload: { searchParams },
});

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

export const updateShout = shout => ({
  types: [
    actionTypes.UPDATE_SHOUT_START,
    actionTypes.UPDATE_SHOUT_SUCCESS,
    actionTypes.UPDATE_SHOUT_FAILURE,
  ],
  payload: { shout },
  service: {
    method: 'update',
    name: 'shout',
    params: { id: shout.id },
    body: shout,
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
