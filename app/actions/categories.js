/* eslint import/prefer-default-export: 0 */

import * as actionTypes from './actionTypes';
import { CATEGORIES } from '../schemas';

export function loadCategories() {
  return {
    types: [
      actionTypes.LOAD_CATEGORIES_START,
      actionTypes.LOAD_CATEGORIES_SUCCESS,
      actionTypes.LOAD_CATEGORIES_FAILURE,
    ],
    service: {
      name: 'categories',
      schema: CATEGORIES,
    },
  };
}
