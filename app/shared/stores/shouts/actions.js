import consts from './consts';

export default {
    update() {
        this.dispatch(consts.UPDATE);
    },

    updateSuccess(res) {
        this.dispatch(consts.UPDATE_SUCCESS, {
            res: res
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
