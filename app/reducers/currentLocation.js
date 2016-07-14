import * as actionTypes from '../actions/actionTypes';
import { createLocationSlug } from '../utils/LocationUtils';

export default function (state = {}, action) {
  switch (action.type) {
    case actionTypes.UPDATE_CURRENT_LOCATION_START:
      return action.payload.location;
    case actionTypes.LOGIN_SUCCESS:
    case actionTypes.SIGNUP_SUCCESS:
      const loggedUser = action.payload.entities.users[action.payload.result];
      return {
        ...loggedUser.location,
        slug: createLocationSlug(loggedUser.location),
      };
    default: return state;
  }
}

export function getCurrentLocation(state) {
  return state.currentLocation;
}
