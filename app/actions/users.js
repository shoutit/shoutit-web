import noop from 'lodash/noop';

import * as actionTypes from './actionTypes';
import { PROFILE, PROFILES, SHOUTS, CONVERSATION, TAGS } from '../schemas';

export function loadUser(username) {
  return {
    types: [
      actionTypes.LOAD_PROFILE_START,
      actionTypes.LOAD_PROFILE_SUCCESS,
      actionTypes.LOAD_PROFILE_FAILURE,
    ],
    service: {
      name: 'profile',
      params: { username },
      schema: PROFILE,
    },
  };
}

export function loadPages(username, { endpoint, query }) {
  return {
    types: [
      actionTypes.LOAD_PROFILE_PAGES_START,
      actionTypes.LOAD_PROFILE_PAGES_SUCCESS,
      actionTypes.LOAD_PROFILE_PAGES_FAILURE,
    ],
    payload: { username },
    service: {
      name: 'profilePages',
      params: {
        username,
        endpoint,
        query,
      },
      schema: PROFILES,
    },
  };
}

export function loadListeners(user, endpoint) {
  return {
    types: [
      actionTypes.LOAD_LISTENERS_START,
      actionTypes.LOAD_LISTENERS_SUCCESS,
      actionTypes.LOAD_LISTENERS_FAILURE,
    ],
    payload: { user },
    service: {
      name: 'listeners',
      params: { username: user.username, endpoint },
      schema: PROFILES,
    },
  };
}

export function loadListeningProfiles(user, endpoint) {
  return {
    types: [
      actionTypes.LOAD_LISTENING_PROFILES_START,
      actionTypes.LOAD_LISTENING_PROFILES_SUCCESS,
      actionTypes.LOAD_LISTENING_PROFILES_FAILURE,
    ],
    payload: { user },
    service: {
      name: 'listening',
      params: { username: user.username, endpoint },
      schema: PROFILES,
    },
  };
}

export function loadListeningTags(user, { endpoint, query }) {
  const { username } = user;
  return {
    types: [
      actionTypes.LOAD_LISTENING_TAGS_START,
      actionTypes.LOAD_LISTENING_TAGS_SUCCESS,
      actionTypes.LOAD_LISTENING_TAGS_FAILURE,
    ],
    payload: { user },
    service: {
      name: 'listeningTags',
      params: {
        endpoint,
        query,
        username,
      },
      schema: TAGS,
    },
  };
}

export function updateProfile(profile) {
  return {
    types: [
      actionTypes.UPDATE_PROFILE_START,
      actionTypes.UPDATE_PROFILE_SUCCESS,
      actionTypes.UPDATE_PROFILE_FAILURE,
    ],
    payload: { profile },
    service: {
      name: 'profile',
      method: 'update',
      body: profile,
      schema: PROFILE,
    },
  };
}

export function updatePassword(body) {
  return {
    types: [
      actionTypes.UPDATE_PASSWORD_START,
      actionTypes.UPDATE_PASSWORD_SUCCESS,
      actionTypes.UPDATE_PASSWORD_FAILURE,
    ],
    service: {
      name: 'password',
      method: 'update',
      body,
    },
  };
}

export function loadHomeShouts(endpoint) {
  return {
    types: [
      actionTypes.LOAD_HOME_SHOUTS_START,
      actionTypes.LOAD_HOME_SHOUTS_SUCCESS,
      actionTypes.LOAD_HOME_SHOUTS_FAILURE,
    ],
    service: {
      name: 'home',
      params: { endpoint },
      schema: SHOUTS,
    },
  };
}

export function loadShoutsByUsername(username, endpoint) {
  return {
    types: [
      actionTypes.LOAD_PROFILE_SHOUTS_START,
      actionTypes.LOAD_PROFILE_SHOUTS_SUCCESS,
      actionTypes.LOAD_PROFILE_SHOUTS_FAILURE,
    ],
    payload: { username },
    service: {
      name: 'shouts',
      params: {
        profile: username,
        endpoint,
      },
      schema: SHOUTS,
    },
  };
}

export function loadProfileDetailsIfNeeded(profile, neededDetails) {
  if (neededDetails.every(detail => profile.hasOwnProperty(detail))) {
    return noop;
  }
  const { username } = profile;
  return {
    types: [
      actionTypes.LOAD_PROFILE_START,
      actionTypes.LOAD_PROFILE_SUCCESS,
      actionTypes.LOAD_PROFILE_FAILURE,
    ],
    service: {
      name: 'profile',
      params: { username },
      schema: PROFILE,
    },
  };
}

export const listenToUser = (loggedUser, user) => ({
  types: [
    actionTypes.LISTEN_START,
    actionTypes.LISTEN_SUCCESS,
    actionTypes.LISTEN_FAILURE,
  ],
  payload: { user, loggedUser, result: user.id },
  service: {
    name: 'listen',
    method: 'create',
    params: { username: user.username },
  },
});

export const stopListeningToUser = (loggedUser, user) => ({
  types: [
    actionTypes.STOP_LISTEN_START,
    actionTypes.STOP_LISTEN_SUCCESS,
    actionTypes.STOP_LISTEN_FAILURE,
  ],
  payload: { user, loggedUser, result: user.id },
  service: {
    name: 'listen',
    method: 'delete',
    params: { username: user.username },
  },
});

export function chatWithProfile(conversation, text) {
  const username = conversation.profiles.filter(profile => !profile.isOwner)[0].username;
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
      name: 'profileChat',
      method: 'create',
      params: { username },
      body: { text },
      schema: CONVERSATION,
    },
  };
}

export const updateProfileStats = (id, stats) => ({
  type: actionTypes.UPDATE_PROFILE_STATS,
  payload: {
    stats,
    id,
  },
});

export const replaceProfile = profile => ({
  type: actionTypes.REPLACE_PROFILE,
  payload: { profile },
});
