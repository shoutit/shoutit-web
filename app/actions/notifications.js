import * as actionTypes from './actionTypes';
import { NOTIFICATIONS } from '../schemas';

export const loadNotifications = ({ endpoint }) => ({
  types: [
    actionTypes.LOAD_NOTIFICATIONS_START,
    actionTypes.LOAD_NOTIFICATIONS_SUCCESS,
    actionTypes.LOAD_NOTIFICATIONS_FAILURE,
  ],
  service: {
    name: 'notifications',
    params: { endpoint },
    schema: NOTIFICATIONS,
  },
});

export function readNotification(notification) {
  return {
    types: [
      actionTypes.READ_NOTIFICATION_START,
      actionTypes.READ_NOTIFICATION_SUCCESS,
      actionTypes.READ_NOTIFICATION_FAILURE,
    ],
    payload: { id: notification.id },
    service: {
      method: 'create',
      name: 'notificationsRead',
      params: { id: notification.id },
    },
  };
}

export const addNotification = notification => ({
  type: actionTypes.ADD_NOTIFICATION,
  payload: notification,
});

export const resetNotifications = () => ({
  types: [
    actionTypes.RESET_NOTIFICATIONS_START,
    actionTypes.RESET_NOTIFICATIONS_SUCCESS,
    actionTypes.RESET_NOTIFICATIONS_FAILURE,
  ],
  service: {
    method: 'create',
    name: 'notificationsReset',
  },
});
