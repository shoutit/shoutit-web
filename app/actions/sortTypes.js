/* eslint import/prefer-default-export: 0 */

import * as actionTypes from './actionTypes';
import { SORT_TYPES } from '../schemas';

export function loadSortTypes() {
  return {
    types: [
      actionTypes.LOAD_SORT_TYPES_START,
      actionTypes.LOAD_SORT_TYPES_SUCCESS,
      actionTypes.LOAD_SORT_TYPES_FAILURE,
    ],
    service: {
      name: 'sortTypes',
      schema: SORT_TYPES,
    },
  };
}
