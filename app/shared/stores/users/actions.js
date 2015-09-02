import consts from './consts';
import client from './client';

export default {
    signup(payload) {
        client.signup(payload).end(function(err,res) {
            if(res) {
                if(res.body.hasOwnProperty('access_token')) { 
                    // success
                    let user = res.body.user;
                    this.dispatch(consts.SIGNUP_SUCCESS, 
                        {email: user.email, name: user.first_name});
                } else { // API rejection
                    this.dispatch(consts.SIGNUP_FAIL, res.body);
                }
            }
        }.bind(this));
    },

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
