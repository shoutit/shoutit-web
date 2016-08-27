/* eslint import/prefer-default-export: 0 */

import Cookies from 'js-cookie';

import * as actionTypes from './actionTypes';
import { PROFILE } from '../schemas';

export function updateCurrentLocation(location) {
  Cookies.set('location', location, { expires: 365 });
  return {
    types: [
      actionTypes.UPDATE_CURRENT_LOCATION_START,
      actionTypes.UPDATE_CURRENT_LOCATION_SUCCESS,
      actionTypes.UPDATE_CURRENT_LOCATION_FAILURE,
    ],
    payload: { location },
    service: {
      method: 'update',
      name: 'location',
      body: { location },
      schema: PROFILE,
    },
  };
}
