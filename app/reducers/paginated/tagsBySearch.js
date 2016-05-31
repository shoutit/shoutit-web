import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';
import { stringifySearchParams } from '../../utils/SearchUtils';

export default createPaginatedReducer({
  mapActionToKey: action => stringifySearchParams(action.payload.searchParams),
  fetchTypes: [
    actionTypes.SEARCH_TAGS_START,
    actionTypes.SEARCH_TAGS_SUCCESS,
    actionTypes.SEARCH_TAGS_FAILURE,
  ],
});
