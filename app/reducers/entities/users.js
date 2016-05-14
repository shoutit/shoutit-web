import * as actionTypes from '../../actions/actionTypes';
import createEntityReducer from './createEntityReducer';

export default createEntityReducer({
  name: 'users',
  mapActionToId: action => action.payload.profile.id,
  updateTypes: [
    actionTypes.UPDATE_PROFILE_START,
    actionTypes.UPDATE_PROFILE_SUCCESS,
    actionTypes.UPDATE_PROFILE_FAILURE,
  ],
});
