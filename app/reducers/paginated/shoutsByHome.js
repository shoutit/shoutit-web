import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';

export default createPaginatedReducer({
  fetchTypes: [
    actionTypes.LOAD_HOME_SHOUTS_START,
    actionTypes.LOAD_HOME_SHOUTS_SUCCESS,
    actionTypes.LOAD_HOME_SHOUTS_FAILURE,
  ],
});
