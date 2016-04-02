import * as actionTypes from '../actions/actionTypes';
import { createLocationSlug } from '../utils/LocationUtils';

export default function (state = {}, action) {
  switch (action.type) {
    case actionTypes.SET_CURRENT_LOCATION:
    case actionTypes.LOAD_CURRENT_LOCATION_SUCCESS:
      return action.payload.location;
    case actionTypes.LOGIN_SUCCESS:
      const { location } = action.payload;
      return {
        ...location,
        slug: createLocationSlug(location),
      };
    default: return state;
  }
}
