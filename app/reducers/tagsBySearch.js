import * as actionTypes from '../actions/actionTypes';
import paginate from './paginate';
import { stringifySearchParams } from '../utils/SearchUtils';

export default paginate({
  mapActionToKey: action => stringifySearchParams(action.payload.searchParams),
  fetchTypes: [
    actionTypes.SEARCH_TAGS_START,
    actionTypes.SEARCH_TAGS_SUCCESS,
    actionTypes.SEARCH_TAGS_FAILURE,
  ],
});
