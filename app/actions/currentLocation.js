/* eslint import/prefer-default-export: 0 */

import Cookies from 'js-cookie';

import * as actionTypes from './actionTypes';
import { PROFILE } from '../schemas';

export function updateCurrentLocation(location) {
  Cookies.set('location', location, { expires: 365 });
  return {
    types: [
      actionTypes.CURRENTLOCATION_UPDATE_START,
      actionTypes.CURRENTLOCATION_UPDATE_SUCCESS,
      actionTypes.CURRENTLOCATION_UPDATE_FAILURE,
    ],
    payload: { location },
    service: {
      method: 'update',
      name: 'currentLocation',
      body: { location },
      schema: PROFILE,
    },
  };
}
