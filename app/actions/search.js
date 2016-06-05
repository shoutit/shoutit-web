
import * as actionTypes from './actionTypes';
import { TAGS, PROFILES, SHOUTS } from '../schemas';

export const searchTags = searchParams => ({
  types: [
    actionTypes.SEARCH_TAGS_START,
    actionTypes.SEARCH_TAGS_SUCCESS,
    actionTypes.SEARCH_TAGS_FAILURE,
  ],
  service: {
    name: 'tags',
    schema: TAGS,
    params: searchParams,
  },
  payload: { searchParams },
});

export const searchProfiles = searchParams => ({
  types: [
    actionTypes.SEARCH_PROFILES_START,
    actionTypes.SEARCH_PROFILES_SUCCESS,
    actionTypes.SEARCH_PROFILES_FAILURE,
  ],
  service: {
    name: 'profiles',
    schema: PROFILES,
    params: searchParams,
  },
  payload: { searchParams },
});

export const searchShouts = searchParams => ({
  types: [
    actionTypes.SEARCH_SHOUTS_START,
    actionTypes.SEARCH_SHOUTS_SUCCESS,
    actionTypes.SEARCH_SHOUTS_FAILURE,
  ],
  service: {
    name: 'profiles',
    schema: SHOUTS,
    params: searchParams,
  },
  payload: { searchParams },
});
