import request from 'superagent';

const PREFIX = "/api/users";
const AUTH_PREFIX = "/api/auth";

export default {
    update(update) {
        return request
            .post(PREFIX + '/me')
            .send(update);
    },

    changePass(query) {
        return request
            .post(AUTH_PREFIX + '/change_password')
            .send(query);
    },

    resendEmail(email) {
        return request
            .post(AUTH_PREFIX + '/verify_email')
            .send({email:email});
    },

    get(username) {
        return request
            .get(PREFIX + '/' + username);
    },

    getListening(username) {
        return request
            .get(PREFIX + '/' + username + '/listening');
    },

    getListeners(username) {
        return request
            .get(PREFIX + '/' + username + '/listeners');
    },

    listen(username) {
        return request
            .post(PREFIX + '/' + username + "/listen");
    },

    stopListen(username) {
        return request
            .del(PREFIX + '/' + username + "/listen");
    },

    loadShouts(username, query) {
        return request
            .get(PREFIX + '/' + username + '/shouts')
            .query(query);
    },

    list(query) {
        return request
            .get(PREFIX + '/')
            .query(query);
    },

    signup(payload) {
        return request
            .post('/auth/signup')
            .type('json')
            .accept('json')
            .send(payload);
    },

    forgetPass(email) {
        return request
            .post('/auth/forget')
            .type('json')
            .accept('json')
            .send({email:email});
    },

    login(token, type) {
        let endpoint;
        let dataPackage = {token:token};

        if (type === 'gplus')
            endpoint = '/auth/gplus';
        else if (type === 'fb')
            endpoint = '/auth/fb';
        else if (type === 'shoutit') {
            endpoint = '/auth/shoutit';
            dataPackage = {email:token.email,pass:token.pass};
        }

        return request
            .post(endpoint)
            .type('json')
            .accept('json')
            .send(dataPackage);
    },

    logout() {
        return request.get('/auth/logout')
            .accept('json');
    }
};
