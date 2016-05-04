import * as actionTypes from '../actions/actionTypes';
import { stringifySearchParams } from '../utils/SearchUtils';

import paginate from './paginate';

export default paginate({
  mapActionToKey: action => stringifySearchParams(action.payload.searchParams),
  fetchTypes: [
    actionTypes.SEARCH_PROFILES_START,
    actionTypes.SEARCH_PROFILES_SUCCESS,
    actionTypes.SEARCH_PROFILES_FAILURE,
  ],
});
