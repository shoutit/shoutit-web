/* eslint import/prefer-default-export: 0 */

import * as actionTypes from './actionTypes';
import { SUGGESTIONS } from '../schemas';

export function loadSuggestions({ query, endpoint } = {}) {
  return {
    types: [
      actionTypes.LOAD_SUGGESTIONS_START,
      actionTypes.LOAD_SUGGESTIONS_SUCCESS,
      actionTypes.LOAD_SUGGESTIONS_FAILURE,
    ],
    service: {
      name: 'suggestions',
      params: { query, endpoint },
      schema: SUGGESTIONS,
    },
  };
}
