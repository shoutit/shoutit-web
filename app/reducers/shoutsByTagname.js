import * as actionTypes from '../actions/actionTypes';
import paginate from './paginate';

export default paginate({
  mapActionToKey: action => action.payload.name,
  fetchTypes: [
    actionTypes.LOAD_TAG_SHOUTS_START,
    actionTypes.LOAD_TAG_SHOUTS_SUCCESS,
    actionTypes.LOAD_TAG_SHOUTS_FAILURE,
  ],
});
