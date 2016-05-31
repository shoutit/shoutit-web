import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';

export default createPaginatedReducer({
  mapActionToKey: action => action.payload.username,
  mapActionToTempId: action => action.payload.shout.id,
  fetchTypes: [
    actionTypes.LOAD_USER_SHOUTS_START,
    actionTypes.LOAD_USER_SHOUTS_SUCCESS,
    actionTypes.LOAD_USER_SHOUTS_FAILURE,
  ],
  createTypes: [
    actionTypes.CREATE_SHOUT_START,
    actionTypes.CREATE_SHOUT_SUCCESS,
  ],
});
