
import * as actionTypes from './actionTypes';
import { CURRENCIES, CATEGORIES } from '../schemas';

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

export function loadCurrencies() {
  return {
    types: [
      actionTypes.LOAD_CURRENCIES_START,
      actionTypes.LOAD_CURRENCIES_SUCCESS,
      actionTypes.LOAD_CURRENCIES_FAILURE,
    ],
    service: {
      name: 'currencies',
      schema: CURRENCIES,
    },
  };
}
