import * as actionTypes from '../../actions/actionTypes';
import createPaginatedReducer from './createPaginatedReducer';
import { getPagination } from '../paginated';

export default createPaginatedReducer({
  fetchTypes: [
    actionTypes.LOAD_NOTIFICATIONS_START,
    actionTypes.LOAD_NOTIFICATIONS_SUCCESS,
    actionTypes.LOAD_NOTIFICATIONS_FAILURE,
  ],
  addType: actionTypes.ADD_NOTIFICATION,
});


export function getNotifications(state) {
  if (!state.paginated.notifications.ids) {
    return [];
  }
  return state.paginated.notifications.ids
    .map(id => state.entities.notifications[id])
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function getPaginationState(state) {
  return getPagination(state, 'notifications');
}
