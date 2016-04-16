/* global google */
import { camelizeKeys } from 'humps';
import * as actionTypes from './actionTypes';
import { trimWhitespaces } from '../utils/StringUtils';

import { Schemas } from '../schemas';

export function loadCurrentLocation() {
  return {
    types: [
      actionTypes.LOAD_CURRENT_LOCATION_START,
      actionTypes.LOAD_CURRENT_LOCATION_SUCCESS,
      actionTypes.LOAD_CURRENT_LOCATION_FAILURE,
    ],
    service: {
      name: 'location',
      params: { latlng: '0,0' },
    },
  };
}

export function loadLocationByLatLng(latlng) {
  return {
    types: [
      actionTypes.LOAD_LOCATION_START,
      actionTypes.LOAD_LOCATION_SUCCESS,
      actionTypes.LOAD_LOCATION_FAILURE,
    ],
    service: {
      name: 'location',
      params: { latlng },
    },
  };
}

export function setCurrentLocation(location) {
  return {
    type: actionTypes.SET_CURRENT_LOCATION,
    payload: { location },
  };
}

export function loadSuggestions(location) {
  return {
    types: [
      actionTypes.LOAD_SUGGESTIONS_START,
      actionTypes.LOAD_SUGGESTIONS_SUCCESS,
      actionTypes.LOAD_SUGGESTIONS_FAILURE,
    ],
    service: {
      name: 'suggestions',
      params: { location },
      schema: Schemas.SUGGESTIONS,
    },
  };
}

export function resetPlacePredictionsLastInput() {
  return {
    type: actionTypes.PLACE_PREDICTIONS_RESET_INPUT,
  };
}

let autocompleteService;
export function loadPlacePredictions(input, types = ['(cities)']) {
  input = trimWhitespaces(input);
  if (!google || !google.maps) {
    const error = new Error('Google Maps Service is not initialized');
    console.error(error); // eslint-disable-line
    return {
      type: actionTypes.PLACE_PREDICTIONS_FAILURE,
      error: true,
      payload: error,
    };
  }
  if (!autocompleteService) {
    autocompleteService = new google.maps.places.AutocompleteService();
  }

  return dispatch => {
    dispatch({
      type: actionTypes.PLACE_PREDICTIONS_START,
      payload: { input },
    });

    autocompleteService.getPlacePredictions({ input, types }, (predictions, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status); // eslint-disable-line
        dispatch({
          type: actionTypes.PLACE_PREDICTIONS_FAILURE,
          error: true,
          payload: new Error(status),
        });
        return;
      }
      dispatch({
        type: actionTypes.PLACE_PREDICTIONS_SUCCESS,
        payload: { input, predictions: camelizeKeys(predictions) },
      });
    });
  };
}
