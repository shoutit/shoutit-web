import * as actionTypes from '../actions/actionTypes';
import paginate from './paginate';

export default paginate({
  mapActionToKey: action => action.payload.discoverItemId,
  fetchTypes: [
    actionTypes.LOAD_DISCOVER_SHOUTS_START,
    actionTypes.LOAD_DISCOVER_SHOUTS_SUCCESS,
    actionTypes.LOAD_DISCOVER_SHOUTS_FAILURE,
  ],
});
