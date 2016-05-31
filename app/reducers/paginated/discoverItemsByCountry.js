import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';

export default createPaginatedReducer({
  mapActionToKey: action => action.payload.country,
  fetchTypes: [
    actionTypes.LOAD_DISCOVER_ITEMS_START,
    actionTypes.LOAD_DISCOVER_ITEMS_SUCCESS,
    actionTypes.LOAD_DISCOVER_ITEMS_FAILURE,
  ],
});
