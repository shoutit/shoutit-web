import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';

export default createPaginatedReducer({
  mapActionToKey: action => action.payload.shoutId,
  fetchTypes: [
    actionTypes.LOAD_RELATED_SHOUTS_START,
    actionTypes.LOAD_RELATED_SHOUTS_SUCCESS,
    actionTypes.LOAD_RELATED_SHOUTS_FAILURE,
  ],
});
