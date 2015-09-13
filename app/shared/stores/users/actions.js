import consts from './consts';
import client from './client';

export default {
    signup(payload) {
        client.signup(payload).end(function(err,res) {
            if(res) {
                if(res.body.id) { 
                    // success
                    this.dispatch(consts.SIGNUP_SUCCESS, res.body);
                } else { // API rejection
                    this.dispatch(consts.SIGNUP_FAIL, res.body);
                }
            }
        }.bind(this));
    },

    // Can be used for more UI errors in the future
    loginErr(type) { 
        if(type ==='no_fb_email') {
            this.dispatch(consts.LOGIN_FB_ERROR);
        }
    },

    forgetPass(email) {
        client.forgetPass(email).end(function(err,res) {
            if(err) {
                this.dispatch(consts.FORGET_RESULT, err);
            } else {
                this.dispatch(consts.FORGET_RESULT, res.body);
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

    changePass(payload) {
        let dataPackage = {}
        if (payload.value.length === 3) {
            dataPackage.old_password = payload.value[0];
            dataPackage.new_password = payload.value[1];
            dataPackage.new_password2 = payload.value[2];
        } else {
            dataPackage.new_password = payload.value[0];
            dataPackage.new_password2 = payload.value[1];
        }
        this.dispatch(consts.PASS_CHANGE, dataPackage);
    },

    resendEmailVerif() {
        this.dispatch(consts.RESEDND_EMAIL_VERIF);
    },

    verifyEmail(token) {
        this.dispatch(consts.VERIFY_EMAIL, {token: token});

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
