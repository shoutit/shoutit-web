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
  const relatedTags = state.paginated.relatedTagsByTag[id];
  if (!relatedTags) {
    return [];
  }
  return relatedTags.ids.map(id => state.entities.tags[id]);
}
