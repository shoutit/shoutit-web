import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';

export default createPaginatedReducer({
  mapActionToKey: action => action.payload.tag.id,
  fetchTypes: [
    actionTypes.LOAD_RELATED_TAGS_START,
    actionTypes.LOAD_RELATED_TAGS_SUCCESS,
    actionTypes.LOAD_RELATED_TAGS_FAILURE,
  ],
});
