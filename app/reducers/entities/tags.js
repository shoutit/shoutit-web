import merge from 'lodash/merge';
import find from 'lodash/find';
import * as actionTypes from '../../actions/actionTypes';
import createEntityReducer from './createEntityReducer';

export default (state, action) => {
  state = createEntityReducer({ name: 'tags' })(state, action);

  const { type, payload } = action;
  switch (type) {
    case actionTypes.LISTEN_TAG_START:
      state = merge({}, state, {
        [payload.tag.id]: {
          isListening: true,
          listenersCount: payload.tag.listenersCount + 1,
        },
      });
      break;
    case actionTypes.STOP_LISTEN_TAG_START:
      state = merge({}, state, {
        [payload.tag.id]: {
          isListening: false,
          listenersCount: payload.tag.listenersCount - 1,
        },
      });
      break;
  }
  return state;
};

export function getTagByName(state, name) {
  return find(state.entities.tags, { name });
}
