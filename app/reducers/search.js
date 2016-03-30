import merge from 'lodash/object/merge';
import { combineReducers } from 'redux';
import paginate from './paginate';

import * as actionTypes from '../actions/actionTypes';

const initialState = {
  tags: { ids: [], searchParams: null },
  shouts: { ids: [], searchParams: null },
  profiles: { ids: [], searchParams: null },
};

const search = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SEARCH_SHOUTS_START:
      return merge({}, state, {
        shouts: { searchParams: action.payload.searchParams },
      });
    case actionTypes.SEARCH_TAGS_START:
      return merge({}, state, {
        tags: { searchParams: action.payload.searchParams },
      });
    case actionTypes.SEARCH_PROFILES_START:
      return merge({}, state, {
        profiles: { searchParams: action.payload.searchParams },
      });
    case actionTypes.SEARCH_CLEAR_ALL:
      return { ...initialState };
  }
  return state;
};

const paginatedSearch = combineReducers({
  shouts: paginate({
    initialState: { ids: [], searchParams: null },
    fetchTypes: [
      actionTypes.SEARCH_SHOUTS_START,
      actionTypes.SEARCH_SHOUTS_SUCCESS,
      actionTypes.SEARCH_SHOUTS_FAILURE,
    ],
  }),
  tags: paginate({
    initialState: { ids: [], searchParams: null },
    fetchTypes: [
      actionTypes.SEARCH_TAGS_START,
      actionTypes.SEARCH_TAGS_SUCCESS,
      actionTypes.SEARCH_TAGS_FAILURE,
    ],
  }),
  profiles: paginate({
    initialState: { ids: [], searchParams: null },
    fetchTypes: [
      actionTypes.SEARCH_PROFILES_START,
      actionTypes.SEARCH_PROFILES_SUCCESS,
      actionTypes.SEARCH_PROFILES_FAILURE,
    ],
  }),
});

export default (state, action) => {
  let newState = paginatedSearch(state, action);
  newState = search(newState, action);
  return newState;
};
