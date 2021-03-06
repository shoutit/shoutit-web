/* global google */

import { camelizeKeys } from 'humps';
import trim from 'lodash/trim';

import * as actionTypes from './actionTypes';

export default function resetPlacePredictionsLastInput() {
  return {
    type: actionTypes.PLACE_PREDICTIONS_RESET_INPUT,
  };
}

let autocompleteService;
export function loadPlacePredictions(input, types = ['(cities)']) {
  input = trim(input);
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
