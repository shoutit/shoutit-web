import isEqual from 'lodash/lang/isEqual';
import debug from 'debug';

const log = debug('shoutit:search-action');

import * as actionTypes from './actionTypes';
import { Schemas } from '../schemas';

const ignoreOldSearchPayload = (searchParams, entity) => (payload, state) => {
  const lastSearch = state.search[entity].searchParams;
  if (!isEqual(lastSearch, searchParams)) {
    log('Ignoring payload because the active search is for %o, while these results were for %o', lastSearch, searchParams);
    return null;
  }
  return payload;
};

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
      parsePayload: ignoreOldSearchPayload(searchParams, 'tags'),
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
      parsePayload: ignoreOldSearchPayload(searchParams, 'profiles'),
    },
    payload: { searchParams },
  };
}

export function searchShouts(searchParams) {
  return {
    types: [
      actionTypes.SEARCH_SHOUTS_START,
      actionTypes.SEARCH_SHOUTS_SUCCESS,
      actionTypes.SEARCH_SHOUTS_FAILURE,
    ],
    service: {
      name: 'shouts',
      schema: Schemas.SHOUTS,
      params: searchParams,
      parsePayload: ignoreOldSearchPayload(searchParams, 'shouts'),
    },
    payload: { searchParams },
  };
}

export function clearSearches() {
  return {
    type: actionTypes.SEARCH_CLEAR_ALL,
  };
}
