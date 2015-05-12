import consts from './consts';

export default {
    update(city) {
        this.dispatch(consts.UPDATE, {
            city
        });
    },

    updateSuccess(res, city) {
        this.dispatch(consts.UPDATE_SUCCESS, {
            res
        });
    },

    requestFailed(err) {
        this.dispatch(consts.REQUEST_FAILED, {
            error: err
        });
    },

    loadMore() {
        this.dispatch(consts.LOAD_MORE);
    },

    loadMoreSuccess(res) {
        this.dispatch(consts.LOAD_MORE_SUCCESS, {
            res: res
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
    }
};
