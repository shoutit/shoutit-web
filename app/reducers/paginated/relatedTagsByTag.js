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

export function getRelatedTags(state, id) {
  const paginated = state.paginated.relatedTagsByTag[id];
  if (!paginated || !paginated.ids) {
    return undefined;
  }
  return paginated.ids.map(id => state.entities.tags[id]);
}
