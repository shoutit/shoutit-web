import request from "superagent";

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

  getDiscoverShouts(id) {
    return request.get(`/api/discover/${id}/shouts`).query({ page_size });
  }
};
