/**
 * Created by Philip on 22.06.2015.
 */

// TODO Do proactive update on reset and read/unread

import Fluxxor from 'fluxxor';
import findIndex from 'lodash/array/findIndex';

import consts from './consts';

const LOG_TAG = "[Notifications-Store]";

let NotificationStore = Fluxxor.createStore({
	initialize({notifications}) {
		this.state = {
			notifications: notifications || [],
			loading: false
		};

		this.bindActions(
			consts.LOAD_NOTIFICATIONS, this.onLoadNotifications,
			consts.LOAD_NOTIFICATIONS_SUCCESS, this.onLoadNotificationsSuccess,
			consts.LOAD_NOTIFICATIONS_FAILED, this.onRequestFailed("load notifications failed"),

			consts.LOAD_MORE_NOTIFICATIONS, this.onLoadMoreNotifications,
			consts.LOAD_MORE_NOTIFICATIONS_SUCCESS, this.onLoadMoreNotificationsSuccess,
			consts.LOAD_MORE_NOTIFICATIONS_FAILED, this.onRequestFailed("load more notifications failed"),

			consts.RESET_NOTIFICATIONS, this.onResetNotifications,
			consts.RESET_NOTIFICATIONS_SUCCESS, this.onResetNotificationsSuccess,
			consts.RESET_NOTIFICATIONS_FAILED, this.onRequestFailed("reset notifications failed"),

			consts.READ_NOTIFICATION, this.onReadNotification,
			consts.READ_NOTIFICATION_SUCCESS, this.onReadNotificationSuccess,
			consts.READ_NOTIFICATION_FAILED, this.onRequestFailed("read notification failed"),

			consts.UNREAD_NOTIFICATION, this.onUnreadNotification,
			consts.UNREAD_NOTIFICATION_SUCCESS, this.onUnreadNotificationSuccess,
			consts.UNREAD_NOTIFICATION_FAILED, this.onRequestFailed("unread notification failed")
		);
	},

	onLoadNotifications() {
		this.state.loading = true;
		this.emit("change");
	},

	saveNotifications(res) {
		if (res.results && res.results.length) {
			this.state.notifications = res.results;
		}
	},

	onLoadNotificationsSuccess({res}) {
		this.saveNotifications(res);
		this.state.loading = false;
		this.emit("change");
	},

	onRequestFailed(tag) {
		return function ({error}) {
			console.error(LOG_TAG, tag, error);
			this.state.loading = false;
			this.emit("change");
		};
	},

	onLoadMoreNotifications() {
		this.state.loading = true;
		this.emit("change");
	},

	onLoadMoreNotificationsSuccess({res}) {
		res.results.forEach(function (not) {
			var index = this.getIndex(not.id);
			if (index >= 0) {
				this.state.notifications[index] = not;
			} else {
				this.state.notifications.push(not);
			}
		}.bind(this));

		this.state.loading = false;
		this.emit("change");
	},

	onResetNotifications() {
		this.state.loading = true;
		this.emit("change");
	},

	onResetNotificationsSuccess() {
		this.state.notifications.forEach(function (not) {
			not.is_read = true;
		});
		this.state.loading = false;
		this.emit("change");
	},

	onReadNotification() {
		this.state.loading = true;
		this.emit("change");
	},

	onReadNotificationSuccess({id}) {
		let index = this.getIndex(id);
		if (index) {
			this.state.notifications[index].is_read = true;
		}
		this.state.loading = false;
		this.emit("change");
	},

	onUnreadNotification() {
		this.state.loading = true;
		this.emit("change");
	},

	onUnreadNotificationSuccess({id}) {
		let index = this.getIndex(id);
		if (index) {
			this.state.notifications[index].is_read = false;
		}
		this.state.loading = false;
		this.emit("change");
	},

	getIndex(notId) {
		return findIndex(this.state.notifications, 'id', notId);
	},

	serialize() {
		return JSON.stringify(this.state);
	},

	hydrate(json) {
		this.state = JSON.parse(json);
	},

	getState() {
		return this.state;
	}
});

export default NotificationStore;
