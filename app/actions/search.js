import * as actionTypes from './actionTypes';
import { Schemas } from '../schemas';

export function searchTags(searchParams) {
  return {
    types: [
      actionTypes.SEARCH_TAGS_START,
      actionTypes.SEARCH_TAGS_SUCCESS,
      actionTypes.SEARCH_TAGS_FAILURE,
    ],
    service: {
      name: 'tags',
      schema: Schemas.TAGS,
      params: searchParams,
    },
    payload: { searchParams },
  };
}

export function searchProfiles(searchParams) {
  return {
    types: [
      actionTypes.SEARCH_PROFILES_START,
      actionTypes.SEARCH_PROFILES_SUCCESS,
      actionTypes.SEARCH_PROFILES_FAILURE,
    ],
    service: {
      name: 'profiles',
      schema: Schemas.PROFILES,
      params: searchParams,
    },
    payload: { searchParams },
  };
}

export function searchShouts(searchParams, endpoint) {
  return {
    types: [
      actionTypes.SEARCH_SHOUTS_START,
      actionTypes.SEARCH_SHOUTS_SUCCESS,
      actionTypes.SEARCH_SHOUTS_FAILURE,
    ],
    service: {
      name: 'shouts',
      schema: Schemas.SHOUTS,
      params: { searchParams, endpoint },
    },
    payload: { searchParams, endpoint },
  };
}
