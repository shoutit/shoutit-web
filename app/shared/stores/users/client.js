import request from 'superagent';

const PREFIX = "/api/users";

export default {
    update(update) {
        return request
            .post(PREFIX + '/me')
            .send(update);
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

    login(token, type) {
        let endpoint;

        if (type === 'gplus') {
            endpoint = '/auth/gplus';
        } else if (type === 'fb') {
            endpoint = '/auth/fb';
        }

        return request
            .post(endpoint)
            .type('json')
            .accept('json')
            .send({token: token});
    },

    logout() {
        return request.get('/auth/logout')
            .accept('json');
    }
};
