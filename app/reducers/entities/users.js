import merge from 'lodash/merge';

import * as actionTypes from '../../actions/actionTypes';
import createEntityReducer from './createEntityReducer';

export default (state, action) => {

  state = createEntityReducer({
    name: 'users',
    mapActionToId: action => action.payload.profile.id,
    updateTypes: [
      actionTypes.UPDATE_PROFILE_START,
      actionTypes.UPDATE_PROFILE_SUCCESS,
      actionTypes.UPDATE_PROFILE_FAILURE,
    ],
  })(state, action);

  const { type, payload } = action;

  switch (type) {
    case actionTypes.LISTEN_START:
      state = merge({}, state, {
        [payload.user.id]: {
          isListening: true,
          listenersCount: payload.user.listenersCount + 1,
        },
        [payload.loggedUser.id]: {
          listeningCount: {
            users: payload.loggedUser.listeningCount.users + 1,
          },
        },
      });
      break;
    case actionTypes.STOP_LISTEN_START:
      state = merge({}, state, {
        [payload.user.id]: {
          isListening: false,
          listenersCount: payload.user.listenersCount - 1,
        },
        [payload.loggedUser.id]: {
          listeningCount: {
            users: payload.loggedUser.listeningCount.users - 1,
          },
        },
      });
      break;
  }

  return state;

};
