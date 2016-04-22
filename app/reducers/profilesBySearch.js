import * as actionTypes from '../actions/actionTypes';
import paginate from './paginate';
import stringify from 'json-stable-stringify';

export default paginate({
  mapActionToKey: action => stringify(action.payload.searchParams),
  fetchTypes: [
    actionTypes.SEARCH_PROFILES_START,
    actionTypes.SEARCH_PROFILES_SUCCESS,
    actionTypes.SEARCH_PROFILES_FAILURE,
  ],
});
