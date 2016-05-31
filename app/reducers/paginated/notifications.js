import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';

export default createPaginatedReducer({
  fetchTypes: [
    actionTypes.LOAD_NOTIFICATIONS_START,
    actionTypes.LOAD_NOTIFICATIONS_SUCCESS,
    actionTypes.LOAD_NOTIFICATIONS_FAILURE,
  ],
  addType: actionTypes.ADD_NOTIFICATION,
});
