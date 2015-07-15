import consts from './consts';

export default {
    login(type, token) {
        this.dispatch(consts.LOGIN, {
            type: type,
            token: token
        });
    },

    logout() {
        this.dispatch(consts.LOGOUT);
    },

    changeInfo(field, value) {
        this.dispatch(consts.INFO_CHANGE, {
            field: field,
            value: value
        });
    },

    saveInfo(field, value) {
        this.dispatch(consts.INFO_SAVE, {
            field: field,
            value: value
        });
    },

    listen(username) {
        this.dispatch(consts.LISTEN, {
            username: username
        });
    },

    stopListen(username) {
        this.dispatch(consts.STOP_LISTEN, {
            username: username
        });
    },

    loadUserListening(username) {
        this.dispatch(consts.LOAD_USER_LISTENING, {
            username: username
        });
    },

    loadUserListeners(username) {
        this.dispatch(consts.LOAD_USER_LISTENERS, {
            username: username
        });
    },

    loadUserShouts(username, type) {
        this.dispatch(consts.LOAD_USER_SHOUTS, {
            username: username,
            type: type
        });
    },

    loadMoreUserShouts(username, type) {
        this.dispatch(consts.LOAD_MORE_USER_SHOUTS, {
            username: username,
            type: type
        });
    },

    loadUser(username) {
        this.dispatch(consts.LOAD_USER, {
            username: username
        });
    },

    showDownloadPopup(){
        this.dispatch(consts.SHOW_DOWNLOAD_POPUP);
    },

    hideDownloadPopup(){
        this.dispatch(consts.HIDE_DOWNLOAD_POPUP);
    }
};
