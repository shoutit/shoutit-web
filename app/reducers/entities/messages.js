import merge from 'lodash/merge';

import * as actionTypes from '../../actions/actionTypes';
import createEntityReducer from './createEntityReducer';

export default (state, action) => {
  state = createEntityReducer({
    name: 'messages',
    mapActionToTempId: action => action.payload.message.id,
    mapActionToTempEntity: action => action.payload.message,
    createTypes: [
      actionTypes.CONVERSATION_REPLY_START,
      actionTypes.CONVERSATION_REPLY_SUCCESS,
      actionTypes.CONVERSATION_REPLY_FAILURE,
    ],
  })(state, action);

  const { type, payload } = action;

  switch (type) {
    case actionTypes.SET_MESSAGE_READ_BY:
      state = merge({}, state, {
        [payload.id]: { readBy: payload.readBy },
      });
      break;
  }
  return state;
};
