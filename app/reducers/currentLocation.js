import * as actionTypes from '../actions/actionTypes';
import { createLocationSlug } from '../utils/LocationUtils';

export default function (state = {}, action) {
  switch (action.type) {
    case actionTypes.UPDATE_CURRENT_LOCATION_START:
      return action.payload.location;
    case actionTypes.LOGIN_SUCCESS:
      const { location } = action.payload.user;
      return {
        ...location,
        slug: createLocationSlug(location),
      };
    default: return state;
  }
}
