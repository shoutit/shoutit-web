import request from 'superagent';
const PREFIX = "/api/discover";

export default {
    getDiscover(query) {
        return request
            .get(PREFIX + '/')
            .query({country: query});
    },

    getDiscoverList(id) {
        return request
            .get(PREFIX + '/' + id);
    },

    getDiscoverShouts(id) {
        return request
            .get(PREFIX + '/' + id + '/shouts');
    }
};