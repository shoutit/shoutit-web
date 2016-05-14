import merge from 'lodash/merge';
import without from 'lodash/without';

import * as actionTypes from '../../actions/actionTypes';
import createEntityReducer from './createEntityReducer';

export default (state, action) => {
  state = createEntityReducer({
    name: 'shouts',
    mapActionToId: action => action.payload.shout.id,
    mapActionToTempId: action => action.payload.shout.id,
    mapActionToTempEntity: action => action.payload.shout,
    createTypes: [
      actionTypes.CREATE_SHOUT_START,
      actionTypes.CREATE_SHOUT_SUCCESS,
      actionTypes.CREATE_SHOUT_FAILURE,
    ],
    updateTypes: [
      actionTypes.UPDATE_SHOUT_START,
      actionTypes.UPDATE_SHOUT_SUCCESS,
      actionTypes.UPDATE_SHOUT_FAILURE,
    ],
    deleteTypes: [
      actionTypes.DELETE_SHOUT_START,
      actionTypes.DELETE_SHOUT_SUCCESS,
      actionTypes.DELETE_SHOUT_FAILURE,
    ],
  })(state, action);

  const { type, payload } = action;

  switch (type) {
    case actionTypes.CALL_SHOUT_START:
      state = merge({}, state, {
        [payload.id]: { isCalling: true },
      });
      break;
    case actionTypes.CALL_SHOUT_SUCCESS:
      state = merge({}, state, {
        [payload.id]: { isCalling: false, mobile: payload.mobile },
      });
      break;
    case actionTypes.CALL_SHOUT_FAILURE:
      state = merge({}, state, {
        [payload.id]: { isCalling: false },
      });
      break;
    case actionTypes.LEAVE_CONVERSATION_START:
      if (payload.type === 'about_shout') {
        const shoutId = payload.about.id;
        state = Object.assign({}, state, {
          [shoutId]: { ...state[shoutId], conversations: without(state[shoutId].conversations, payload.id) },
        });
      }
      break;
    case actionTypes.CREATE_CONVERSATION_SUCCESS:
      if (payload.conversation.type === 'about_shout') {
        const shoutId = payload.conversation.about.id;
        state = merge({}, state, {
          [shoutId]: { conversations: [payload.result] },
        });
      }

      break;
  }
  return state;
};
