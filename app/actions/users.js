
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
      name: 'listeners',
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
      type: 'NOOP',
      payload: {},
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
