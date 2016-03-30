import merge from 'lodash/object/merge';

import * as actionTypes from '../actions/actionTypes';

const initialState = {
  tags: { ids: [], searchParams: null },
  shouts: { ids: [], searchParams: null },
  profiles: { ids: [], searchParams: null },
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.SEARCH_SHOUTS_START:
      return merge({}, state, {
        shouts: { searchParams: payload.searchParams },
      });
    case actionTypes.SEARCH_TAGS_START:
      return merge({}, state, {
        tags: { searchParams: payload.searchParams },
      });
    case actionTypes.SEARCH_PROFILES_START:
      return merge({}, state, {
        profiles: { searchParams: payload.searchParams },
      });
    case actionTypes.SEARCH_PROFILES_SUCCESS:
      return {
        ...state,
        profiles: {
          ...state.profiles,
          ids: payload ? payload.result : state.profiles.ids,
        },
      };
    case actionTypes.SEARCH_TAGS_SUCCESS:
      return {
        ...state,
        tags: {
          ...state.tags,
          ids: payload ? payload.result : state.tags.ids,
        },
      };
    case actionTypes.SEARCH_SHOUTS_SUCCESS:
      return {
        ...state,
        shouts: {
          ...state.shouts,
          ids: payload ? payload.result : state.shouts.ids,
        },
      };
    case actionTypes.SEARCH_CLEAR_ALL:
      return { ...initialState };
  }
  return state;
}
