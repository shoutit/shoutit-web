import request from "superagent";
import {assign} from "lodash/object";

const page_size = 8;

export default {

  getDiscover(countryCode) {
    return request.get("/api/discover/").query({
      country: countryCode.toUpperCase(),
      page_size
    });
  },

  getDiscoverList(id) {
    return request.get(`/api/discover/${id}`);
  },

  getDiscoverShouts(id, query = {}) {
    return request.get(`/api/discover/${id}/shouts`)
      .query( assign(query, {page_size}) );
  }
};
