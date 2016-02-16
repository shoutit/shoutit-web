/**
 * Created by Philip on 23.06.2015.
 */

import request from "superagent";

// GOOGLE API
const API_KEY = "AIzaSyBTB6-OnMETp1wjS8ZnUugqrlW5UcdEkgc";
const GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const DEFAULT_LANGUAGE = "en";

export default {
  geocode(lat, lng) {
    const pos = {};
    pos.latlng = [lat, lng].join(",");

    // just to prevent npm from caching 0,0 position
    if (lat === 0 && lng === 0) {
      pos.key = Date.now() + Math.floor(Math.random() * 100);
    }

    return request.get("/api/misc/geocode").query(pos);
  },

  cityGeocode(country, state, city) {
    return request.get(GEOCODE_URL)
      .query({
        address: city,
        components: "country:" + country + "|administrative_area:" + state
      });
  },

  placeGeocode(placeId) {
    return request.get(GEOCODE_URL)
      .query({
        place_id: placeId,
        language: DEFAULT_LANGUAGE,
        key: API_KEY
      });
  }
};
