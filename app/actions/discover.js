import * as actionTypes from './actionTypes';
import { Schemas } from '../schemas';

export function loadDiscoverItem(id) {
  return {
    types: [
      actionTypes.LOAD_DISCOVER_ITEM_START,
      actionTypes.LOAD_DISCOVER_ITEM_SUCCESS,
      actionTypes.LOAD_DISCOVER_ITEM_FAILURE,
    ],
    payload: { id },
    service: {
      name: 'discover',
      params: { id },
    },
  };
}

export function loadMainDiscoverItem(country) {
  return {
    types: [
      actionTypes.LOAD_MAIN_DISCOVER_ITEM_START,
      actionTypes.LOAD_MAIN_DISCOVER_ITEM_SUCCESS,
      actionTypes.LOAD_MAIN_DISCOVER_ITEM_FAILURE,
    ],
    payload: { country },
    service: {
      name: 'discover',
      params: { searchParams: { country } },
      schema: Schemas.DISCOVERITEMS,
    },
  };
}
