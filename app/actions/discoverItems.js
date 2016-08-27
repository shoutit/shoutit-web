import * as actionTypes from './actionTypes';
import { DISCOVERITEM, DISCOVERITEMS, SHOUTS } from '../schemas';

export function loadDiscoverItem(id) {
  return {
    types: [
      actionTypes.DISCOVERITEM_LOAD_START,
      actionTypes.DISCOVERITEM_LOAD_SUCCESS,
      actionTypes.DISCOVERITEM_LOAD_FAILURE,
    ],
    payload: { id },
    service: {
      name: 'discover',
      params: { id },
      schema: DISCOVERITEM,
    },
  };
}

export function loadDiscoverItems(country) {
  return {
    types: [
      actionTypes.DISCOVERITEMS_LOAD_START,
      actionTypes.DISCOVERITEMS_LOAD_SUCCESS,
      actionTypes.DISCOVERITEMS_LOAD_FAILURE,
    ],
    payload: { country },
    service: {
      name: 'discover',
      params: { searchParams: { country } },
      schema: DISCOVERITEMS,
    },
  };
}

export function loadDiscoverItemShouts(discoverItemId, searchParams, endpoint) {
  return {
    types: [
      actionTypes.DISCOVERITEMS_SHOUTS_LOAD_START,
      actionTypes.DISCOVERITEMS_SHOUTS_LOAD_SUCCESS,
      actionTypes.DISCOVERITEMS_SHOUTS_LOAD_FAILURE,
    ],
    payload: { discoverItemId, searchParams },
    service: {
      name: 'shouts',
      params: {
        ...searchParams,
        discover: discoverItemId,
        endpoint,
      },
      schema: SHOUTS,
    },
  };
}
