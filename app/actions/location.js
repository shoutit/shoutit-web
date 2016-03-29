import * as actionTypes from './actionTypes';

import { suggestion } from '../schemas';

export function getCurrentLocation() {
  return {
    types: [
      actionTypes.GET_CURRENT_LOCATION_START,
      actionTypes.GET_CURRENT_LOCATION_SUCCESS,
      actionTypes.GET_CURRENT_LOCATION_FAILURE
    ],
    service: {
      name: 'location',
      params: { latlng: '0,0' }
    }
  };
}

export function getLocation(latlng) {
  return {
    types: [
      actionTypes.GET_LOCATION_START,
      actionTypes.GET_LOCATION_SUCCESS,
      actionTypes.GET_LOCATION_FAILURE
    ],
    service: {
      name: 'location',
      params: { latlng }
    }
  };
}

export function loadSuggestions(location) {
  return {
    types: [
      actionTypes.LOAD_SUGGESTIONS_START,
      actionTypes.LOAD_SUGGESTIONS_SUCCESS,
      actionTypes.LOAD_SUGGESTIONS_FAILURE
    ],
    service:{
      name: 'suggestions',
      params: { location },
      schema: suggestion
    }
  };
}
