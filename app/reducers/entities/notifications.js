import merge from 'lodash/merge';
import createEntityReducer from './createEntityReducer';
import { READ_NOTIFICATION_START, RESET_NOTIFICATIONS_START } from '../../actions/actionTypes';

export default (state, action) => {
  state = createEntityReducer({ name: 'notifications' })(state, action);
  switch (action.type) {
    case READ_NOTIFICATION_START:
      state = merge({}, state, {
        [action.payload.id]: {
          isRead: true,
        },
      });
      break;
    case RESET_NOTIFICATIONS_START:
      state = { ...state };
      Object.keys(state).forEach(id => {
        state[id].isRead = true;
      });
      break;
    default:
      break;
  }
  return state;
};
