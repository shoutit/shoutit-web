import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';

export default createPaginatedReducer({
  mapActionToKey: action => action.payload.discoverItemId,
  fetchTypes: [
    actionTypes.LOAD_DISCOVER_SHOUTS_START,
    actionTypes.LOAD_DISCOVER_SHOUTS_SUCCESS,
    actionTypes.LOAD_DISCOVER_SHOUTS_FAILURE,
  ],
});
