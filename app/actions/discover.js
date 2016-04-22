import * as actionTypes from './actionTypes';
import { DISCOVERITEM, DISCOVERITEMS, SHOUTS } from '../schemas';

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
      schema: DISCOVERITEM,
    },
  };
}

export function loadDiscoverItemsByCountry(country) {
  return {
    types: [
      actionTypes.LOAD_DISCOVER_ITEMS_START,
      actionTypes.LOAD_DISCOVER_ITEMS_SUCCESS,
      actionTypes.LOAD_DISCOVER_ITEMS_FAILURE,
    ],
    payload: { country },
    service: {
      name: 'discover',
      params: { searchParams: { country } },
      schema: DISCOVERITEMS,
    },
  };
}

export function loadShoutsForDiscoverItem(discoverItemId, searchParams, endpoint) {
  return {
    types: [
      actionTypes.LOAD_DISCOVER_SHOUTS_START,
      actionTypes.LOAD_DISCOVER_SHOUTS_SUCCESS,
      actionTypes.LOAD_DISCOVER_SHOUTS_FAILURE,
    ],
    payload: { discoverItemId, searchParams },
    service: {
      name: 'shouts',
      params: {
        endpoint,
        searchParams: {
          ...searchParams,
          discover: discoverItemId,
        },
      },
      schema: SHOUTS,
    },
  };
}
