/* eslint import/prefer-default-export: 0 */

import * as actionTypes from './actionTypes';
import { CURRENCIES } from '../schemas';

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
