import * as actionTypes from '../actions/actionTypes';
import paginate from './paginate';

export default paginate({
  mapActionToKey: action => action.payload.tag.id,
  fetchTypes: [
    actionTypes.LOAD_RELATED_TAGS_START,
    actionTypes.LOAD_RELATED_TAGS_SUCCESS,
    actionTypes.LOAD_RELATED_TAGS_FAILURE,
  ],
});
