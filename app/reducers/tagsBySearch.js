import * as actionTypes from '../actions/actionTypes';
import paginate from './paginate';
import stringify from 'json-stable-stringify';

export default paginate({
  mapActionToKey: action => stringify(action.payload.searchParams),
  fetchTypes: [
    actionTypes.SEARCH_TAGS_START,
    actionTypes.SEARCH_TAGS_SUCCESS,
    actionTypes.SEARCH_TAGS_FAILURE,
  ],
});
