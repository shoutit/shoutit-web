import * as actionTypes from '../actions/actionTypes';
import paginate from './paginate';

export default paginate({
  fetchTypes: [
    actionTypes.LOAD_SUGGESTIONS_START,
    actionTypes.LOAD_SUGGESTIONS_SUCCESS,
    actionTypes.LOAD_SUGGESTIONS_FAILURE,
  ],
});
