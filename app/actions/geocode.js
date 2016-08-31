/* eslint import/prefer-default-export: 0 */

import * as actionTypes from './actionTypes';

export function geocodeCoordinates({ latitude, longitude }) {
  return {
    types: [
      actionTypes.GEOCODE_COORDINATES_START,
      actionTypes.GEOCODE_COORDINATES_SUCCESS,
      actionTypes.GEOCODE_COORDINATES_FAILURE,
    ],
    service: {
      name: 'geocode',
      params: {
        query: {
          latlng: `${latitude},${longitude}`,
        },
      },
    },
  };
}
