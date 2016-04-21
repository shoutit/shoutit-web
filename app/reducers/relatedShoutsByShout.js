import * as actionTypes from '../actions/actionTypes';
import paginate from './paginate';

export default paginate({
  mapActionToKey: action => action.payload.shoutId,
  fetchTypes: [
    actionTypes.LOAD_RELATED_SHOUTS_START,
    actionTypes.LOAD_RELATED_SHOUTS_SUCCESS,
    actionTypes.LOAD_RELATED_SHOUTS_FAILURE,
  ],
});
