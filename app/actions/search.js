import omit from 'lodash/omit';

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

export const searchShouts = (location, searchParams, endpoint) => ({
  types: [
    actionTypes.SEARCH_SHOUTS_START,
    actionTypes.SEARCH_SHOUTS_SUCCESS,
    actionTypes.SEARCH_SHOUTS_FAILURE,
  ],
  service: {
    name: 'shouts',
    schema: SHOUTS,
    params: { searchParams, location: omit(location, ['slug', 'name']), endpoint },
  },
  payload: { searchParams, endpoint },
});

export const invalidateShoutsSearch = (searchParams) => ({
  type: actionTypes.INVALIDATE_SHOUTS_SEARCH,
  payload: { searchParams },
});
