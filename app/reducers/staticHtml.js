import * as actionTypes from '../actions/actionTypes';

const buildState = (isFetching = true, content) => ({
  isFetching,
  content,
});

export default function (state = {}, action) {
  switch (action.type) {
    case actionTypes.LOAD_STATIC_HTML_START:
      return {
        ...state,
        [action.pageName]: buildState(true),
      };
    case actionTypes.LOAD_STATIC_HTML_SUCCESS:
      return {
        ...state,
        [action.pageName]: buildState(false, action.payload.content),
      };
    case actionTypes.LOAD_STATIC_HTML_FAILURE:
      return {
        ...state,
        [action.pageName]: buildState(false),
      };
  }

  return state;
}

export function getStaticHtml(state, pageName) {
  return state.staticHtml[pageName];
}
