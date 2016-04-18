
import * as actionTypes from './actionTypes';
import { Schemas } from '../schemas';

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
      schema: Schemas.PROFILE,
    },
  };
}

export function loadListeners(user) {
  return {
    types: [
      actionTypes.LOAD_LISTENERS_START,
      actionTypes.LOAD_LISTENERS_SUCCESS,
      actionTypes.LOAD_LISTENERS_FAILURE,
    ],
    payload: { user },
    service: {
      name: 'listeners',
      params: { user },
      schema: Schemas.PROFILES,
    },
  };
}

export function loadListening(user) {
  return {
    types: [
      actionTypes.LOAD_LISTENING_START,
      actionTypes.LOAD_LISTENING_SUCCESS,
      actionTypes.LOAD_LISTENING_FAILURE,
    ],
    payload: { user },
    service: {
      name: 'listening',
      params: { user },
      schema: Schemas.PROFILES,
    },
  };
}

export function setUserLocation(location) {
  return {
    types: [
      actionTypes.SET_USER_LOCATION_START,
      actionTypes.SET_USER_LOCATION_SUCCESS,
      actionTypes.SET_USER_LOCATION_FAILURE,
    ],
    payload: { location },
    service: {
      name: 'profile',
      method: 'update',
      body: { location },
      schema: Schemas.PROFILE,
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
      schema: Schemas.SHOUTS,
    },
  };
}

export function loadUserShouts(searchParams, endpoint) {
  return {
    types: [
      actionTypes.LOAD_USER_SHOUTS_START,
      actionTypes.LOAD_USER_SHOUTS_SUCCESS,
      actionTypes.LOAD_USER_SHOUTS_FAILURE,
    ],
    payload: { username: searchParams.user },
    service: {
      name: 'shouts',
      params: { searchParams, endpoint },
      schema: Schemas.SHOUTS,
    },
  };
}

export function loadProfileDetailsIfNeeded(profile, neededDetails) {
  if (neededDetails.every(detail => profile.hasOwnProperty(detail))) {
    return {
      type: null,
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
      schema: Schemas.PROFILE,
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
      params: { user },
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
      params: { user },
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
