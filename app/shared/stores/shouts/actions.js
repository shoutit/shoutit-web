import consts from './consts';

export default {
	update(city) {
		this.dispatch(consts.UPDATE, {
			city
		});
	},

	updateSuccess(res, type) {
		this.dispatch(consts.UPDATE_SUCCESS, {
			res, type
		});
	},

	requestFailed(err) {
		this.dispatch(consts.REQUEST_FAILED, {
			error: err
		});
	},

	loadMore(type) {
		this.dispatch(consts.LOAD_MORE, {
			type
		});
	},

	loadMoreSuccess(res, type) {
		this.dispatch(consts.LOAD_MORE_SUCCESS, {
			res, type
		});
	},


	loadShout(shoutId) {
		this.dispatch(consts.LOAD_SHOUT, {
			shoutId: shoutId
		});
	},

	loadShoutSuccess(res) {
		this.dispatch(consts.LOAD_SHOUT_SUCCESS, {
			res: res
		});
	},

	loadShoutFailed(shoutId, res) {
		this.dispatch(consts.LOAD_SHOUT_FAILED, {
			shoutId: shoutId,
			res: res
		});
	}
};
