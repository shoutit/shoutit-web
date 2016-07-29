import * as actionTypes from '../actions/actionTypes';
import { getFilename, getPathFromUrl } from '../utils/StringUtils';

const buildState = (isFetching = true, content) => ({
  isFetching,
  content,
});

export default function (state = {}, action) {
  switch (action.type) {
    case actionTypes.LOAD_STATIC_START:
      return {
        ...state,
        [action.id]: buildState(true),
      };
    case actionTypes.LOAD_STATIC_SUCCESS:
      return {
        ...state,
        [action.id]: buildState(false, action.payload.content),
      };
    case actionTypes.LOAD_STATIC_FAILURE:
      return {
        ...state,
        [action.id]: buildState(false),
      };
  }

  return state;
}

export function getStaticPage(state) {
  const url = getFilename(state.routing.currentUrl);
  const resource_path = getPathFromUrl(url);
  return state.staticPages[resource_path] || {};
}

export function getStaticContent(page) {
  return page && page.content;
}
