import request from 'superagent';
import { assign } from 'lodash/object';

const page_size = 8;
const SHOUTS_PREFIX = '/api/shouts';

export default {

  getDiscover(countryCode) {
    return request.get('/api/discover/').query({
      country: countryCode.toUpperCase(),
      page_size
    });
  },

  getDiscoverList(id) {
    return request.get(`/api/discover/${id}`);
  },

  getDiscoverShouts(id, query = {}) {
    query.discover = id;

    return request.get(SHOUTS_PREFIX)
      .query({ ...query, page_size });
  }
};
