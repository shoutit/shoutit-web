
import * as actionTypes from './actionTypes';
import { PROFILE, PROFILES, SHOUTS } from '../schemas';

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

export function loadListening(user, endpoint) {
  return {
    types: [
      actionTypes.LOAD_LISTENING_START,
      actionTypes.LOAD_LISTENING_SUCCESS,
      actionTypes.LOAD_LISTENING_FAILURE,
    ],
    payload: { user },
    service: {
      name: 'listening',
      params: { username: user.username, endpoint },
      schema: PROFILES,
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

export function loadUserShouts(username, endpoint) {
  return {
    types: [
      actionTypes.LOAD_USER_SHOUTS_START,
      actionTypes.LOAD_USER_SHOUTS_SUCCESS,
      actionTypes.LOAD_USER_SHOUTS_FAILURE,
    ],
    payload: { username },
    service: {
      name: 'shouts',
      params: {
        searchParams: { profile: username },
        endpoint,
      },
      schema: SHOUTS,
    },
  };
}

export function loadProfileDetailsIfNeeded(profile, neededDetails) {
  if (neededDetails.every(detail => profile.hasOwnProperty(detail))) {
    return {
      type: 'NOOP',
    };
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

export function listenToUser(loggedUser, user) {
  const entities = {
    users: {
      [user.id]: {
        ...user,
        isListening: true,
        listenersCount: user.listenersCount + 1,
      },
      [loggedUser.id]: {
        ...loggedUser,
        listeningCount: {
          ...loggedUser.listeningCount,
          users: loggedUser.listeningCount.users + 1,
        },
      },
    },
  };
  return {
    types: [
      actionTypes.LISTEN_START,
      actionTypes.LISTEN_SUCCESS,
      actionTypes.LISTEN_FAILURE,
    ],
    payload: { user, loggedUser, result: user.id, entities },
    service: {
      name: 'listen',
      method: 'create',
      params: { username: user.username },
      parsePayload: payload => {
        payload = {
          ...payload,
          entities: payload.error ?
            { users: {
              [user.id]: user,   // restore original users
              [loggedUser.id]: loggedUser,
            } } :
            entities,
        };
        return payload;
      },
    },
  };
}

export function stopListeningToUser(loggedUser, user) {
  const entities = {
    users: {
      [user.id]: {
        ...user,
        isListening: false,
        listenersCount: user.listenersCount - 1,
      },
      [loggedUser.id]: {
        ...loggedUser,
        listeningCount: {
          ...loggedUser.listeningCount,
          users: loggedUser.listeningCount.users - 1,
        },
      },
    },
  };
  return {
    types: [
      actionTypes.STOP_LISTEN_START,
      actionTypes.STOP_LISTEN_SUCCESS,
      actionTypes.STOP_LISTEN_FAILURE,
    ],
    payload: { user, loggedUser, result: user.id, entities },
    service: {
      name: 'listen',
      method: 'delete',
      params: { username: user.username },
      parsePayload: payload => {
        payload = {
          ...payload,
          entities: payload.error ?
            { users: {
              [user.id]: user,   // restore original users
              [loggedUser.id]: loggedUser,
            } } :
            entities,
        };
        return payload;
      },
    },
  };
}
