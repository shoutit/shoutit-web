import request from 'superagent';

const PREFIX = "/api/shouts";

export default {
    list: function (query) {
        return request
            .get(PREFIX + '/')
            .query(query);
    },
    get: function (shoutId) {
        return request
            .get(PREFIX + '/' + shoutId);
    }
};
