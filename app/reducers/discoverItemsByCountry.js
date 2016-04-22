import * as actionTypes from '../actions/actionTypes';
import paginate from './paginate';

export default paginate({
  mapActionToKey: action => action.payload.country,
  fetchTypes: [
    actionTypes.LOAD_DISCOVER_ITEMS_START,
    actionTypes.LOAD_DISCOVER_ITEMS_SUCCESS,
    actionTypes.LOAD_DISCOVER_ITEMS_FAILURE,
  ],
});
