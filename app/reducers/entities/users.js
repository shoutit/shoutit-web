import merge from 'lodash/merge';
import find from 'lodash/find';

import { denormalize } from '../../schemas';
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
    case actionTypes.LISTEN_TAG_START:
      state = merge({}, state, {
        [payload.loggedUser.id]: {
          listeningCount: { tags: payload.loggedUser.listeningCount.tags + 1 },
        },
      });
      break;
    case actionTypes.STOP_LISTEN_TAG_START:
      state = merge({}, state, {
        [payload.loggedUser.id]: {
          listeningCount: { tags: payload.loggedUser.listeningCount.tags - 1 },
        },
      });
      break;
    case actionTypes.UPDATE_PROFILE_STATS:
      state = merge({}, state, {
        [payload.id]: { stats: payload.stats },
      });
      break;
    case actionTypes.REPLACE_PROFILE:
      state = merge({}, state, {
        [payload.profile.id]: payload.profile,
      });
      break;
    case actionTypes.CONVERSATION_LEAVE_START:
      if (payload.type === 'chat') {
        state = Object.assign({}, state);
        payload.profiles.map(profile => state[profile.id].conversation = null);
      }
      break;
  }
  return state;
};

export function getProfile(state, username) {
  return denormalize(find(state.entities.users, { username }), state.entities, 'PROFILE');
}
