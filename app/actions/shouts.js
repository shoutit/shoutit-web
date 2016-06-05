import omit from 'lodash/omit';
import omitBy from 'lodash/omitBy';

import * as actionTypes from './actionTypes';
import { SHOUT, SHOUTS, CONVERSATION } from '../schemas';
import { getUnixTime } from '../utils/DateUtils';

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


export const loadShouts = (location, params, endpoint) => {
  location = omitBy(location, i => !i);
  let searchLocation = omit(location, ['slug', 'name', 'postalCode']);
  searchLocation.postal_code = location.postalCode;
  let searchParams = { ...params };
  switch (searchParams.within) {
    case 'country':
      searchParams = omit(searchParams, ['within']);
      searchLocation = omit(searchLocation, ['latitude', 'longitude', 'postal_code', 'address', 'city', 'state']);
      break;
    case 'state':
      searchParams = omit(searchParams, ['within']);
      searchLocation = omit(searchLocation, ['latitude', 'longitude', 'postal_code', 'address', 'city']);
      break;
    default:
      break;
  }
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
        searchParams,
        location: searchLocation,
        endpoint,
      },
    },
    payload: { searchParams, endpoint },
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
    createdAt: getUnixTime(),
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

export function amendShout(shout, data) {
  return {
    type: actionTypes.AMEND_SHOUT,
    payload: {
      entities: {
        shouts: {
          [shout.id]: {
            ...shout,
            ...data,
          },
        },
      },
    },
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
