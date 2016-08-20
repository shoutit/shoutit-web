import * as actionTypes from './actionTypes';
import { TAGS, PROFILES, SHOUTS } from '../schemas';

export const searchTags = query => ({
  types: [
    actionTypes.SEARCH_TAGS_START,
    actionTypes.SEARCH_TAGS_SUCCESS,
    actionTypes.SEARCH_TAGS_FAILURE,
  ],
  service: {
    name: 'tags',
    schema: TAGS,
    params: query,
  },
  payload: { query },
});

export const searchProfiles = query => ({
  types: [
    actionTypes.SEARCH_PROFILES_START,
    actionTypes.SEARCH_PROFILES_SUCCESS,
    actionTypes.SEARCH_PROFILES_FAILURE,
  ],
  service: {
    name: 'profiles',
    schema: PROFILES,
    params: query,
  },
  payload: { query },
});


export const searchShouts = query => {
  return {
    types: [
      actionTypes.SEARCH_SHOUTS_START,
      actionTypes.SEARCH_SHOUTS_SUCCESS,
      actionTypes.SEARCH_SHOUTS_FAILURE,
    ],
    service: {
      name: 'shouts',
      schema: SHOUTS,
      params: query,
    },
    payload: { query },
  };

};

export const invalidateSearch = () => ({ type: actionTypes.INVALIDATE_SEARCH });
