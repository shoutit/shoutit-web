import * as actionTypes from './actionTypes';
import { CURRENCIES, CATEGORIES, SORT_TYPES } from '../schemas';

export const loadCategories = () => ({
  types: [
    actionTypes.LOAD_CATEGORIES_START,
    actionTypes.LOAD_CATEGORIES_SUCCESS,
    actionTypes.LOAD_CATEGORIES_FAILURE,
  ],
  service: {
    name: 'categories',
    schema: CATEGORIES,
  },
});

export const loadCurrencies = () => ({
  types: [
    actionTypes.LOAD_CURRENCIES_START,
    actionTypes.LOAD_CURRENCIES_SUCCESS,
    actionTypes.LOAD_CURRENCIES_FAILURE,
  ],
  service: {
    name: 'currencies',
    schema: CURRENCIES,
  },
});

export const loadSortTypes = () => ({
  types: [
    actionTypes.LOAD_SORT_TYPES_START,
    actionTypes.LOAD_SORT_TYPES_SUCCESS,
    actionTypes.LOAD_SORT_TYPES_FAILURE,
  ],
  service: {
    name: 'sortTypes',
    schema: SORT_TYPES,
  },
});

