import * as actionTypes from '../actions/actionTypes';
import paginate from './paginate';

export default paginate({
  fetchTypes: [
    actionTypes.LOAD_HOME_SHOUTS_START,
    actionTypes.LOAD_HOME_SHOUTS_SUCCESS,
    actionTypes.LOAD_HOME_SHOUTS_FAILURE,
  ],
});
