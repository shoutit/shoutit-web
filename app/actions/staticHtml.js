/* eslint import/prefer-default-export: 0 */

import * as actionTypes from './actionTypes';

export function loadStaticHtml(pageName) {
  return {
    pageName,
    types: [
      actionTypes.LOAD_STATIC_HTML_START,
      actionTypes.LOAD_STATIC_HTML_SUCCESS,
      actionTypes.LOAD_STATIC_HTML_FAILURE,
    ],
    service: {
      name: 'staticHtml',
      params: { pageName },
    },
  };
}
