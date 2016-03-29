import request from 'superagent';

const PREFIX = '/api/misc/suggestions';

export default {
  getSuggestions(query) {
    return request
            .get(PREFIX + '/')
            .query(query);
  },
};
