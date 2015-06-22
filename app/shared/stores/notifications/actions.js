/**
 * Created by Philip on 22.06.2015.
 */

import consts from './consts';
import client from './client';


export default {
	load() {
		this.dispatch(consts.LOAD_NOTIFICATIONS);

		client.list()
			.end(function (error, res) {
				if (error) {
					this.dispatch(consts.LOAD_NOTIFICATIONS_FAILED, {
						error
					});
				} else {
					this.dispatch(consts.LOAD_NOTIFICATIONS_SUCCESS, {
						res
					});
				}
			});
	},

	loadMore(before) {
		this.dispatch(consts.LOAD_MORE_NOTIFICATIONS);

		client.list()
			.query({before})
			.end(function (error, res) {
				if (error) {
					this.dispatch(consts.LOAD_MORE_NOTIFICATIONS_FAILED, {
						error
					});
				} else {
					this.dispatch(consts.LOAD_MORE_NOTIFICATIONS_SUCCESS, {
						before,
						res
					});
				}
			});
	},

	reset() {
		this.dispatch(consts.RESET_NOTIFICATIONS);

		client.reset()
			.end(function (error) {
				if (error) {
					this.dispatch(consts.RESET_NOTIFICATIONS_FAILED, {
						error
					});
				} else {
					this.dispatch(consts.RESET_NOTIFICATIONS_SUCCESS);
				}
			});
	},

	read(id) {
		this.dispatch(consts.READ_NOTIFICATION, {
			id
		});

		client.read(id)
			.end(function (error) {
				if (error) {
					this.dispatch(consts.READ_NOTIFICATION_FAILED, {
						id, error
					});
				} else {
					this.dispatch(consts.READ_NOTIFICATION_SUCCESS, {
						id
					});
				}
			});
	},

	unread(id) {
		this.dispatch(consts.UNREAD_NOTIFICATION, {
			id
		});

		client.unread(id)
			.end(function (error) {
				if (error) {
					this.dispatch(consts.UNREAD_NOTIFICATION_FAILED, {
						id, error
					});
				} else {
					this.dispatch(consts.UNREAD_NOTIFICATION_SUCCESS, {
						id
					});
				}
			});
	}

};
