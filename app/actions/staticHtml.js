import * as actionTypes from './actionTypes';

export function loadStaticHtml(id) {
  return {
    id,
    types: [
      actionTypes.LOAD_STATIC_HTML_START,
      actionTypes.LOAD_STATIC_HTML_SUCCESS,
      actionTypes.LOAD_STATIC_HTML_FAILURE,
    ],
    service: {
      name: 'staticHtml',
      params: { id },
    },
  };
}
