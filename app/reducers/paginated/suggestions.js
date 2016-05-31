import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';

export default createPaginatedReducer({
  fetchTypes: [
    actionTypes.LOAD_SUGGESTIONS_START,
    actionTypes.LOAD_SUGGESTIONS_SUCCESS,
    actionTypes.LOAD_SUGGESTIONS_FAILURE,
  ],
});
