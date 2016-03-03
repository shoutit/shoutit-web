import { GET_SUGGESTIONS, GET_SUGGESTIONS_SUCCESS, GET_SUGGESTIONS_FAIL } from "./actionTypes";
import client from "./client";
const debug = require("debug")("shoutit:actions");

export default {
  getSuggestions(currentLocation) {
    const {country, state, city} = currentLocation;
    const pageSize = 8;

    client.getSuggestions({
      country,
      state,
      city,
      page_size: pageSize
    }).end((err, res) => {
      if(err) {
        this.dispatch(GET_SUGGESTIONS_FAIL, {currentLocation});
        debug(err);
      } else if(res.status === 200) {
        this.dispatch(GET_SUGGESTIONS_SUCCESS, {
          res: res.body,
          currentLocation
        });
      } else {
        this.dispatch(GET_SUGGESTIONS_FAIL, {currentLocation});
        debug(res.body);
      }
    });

    this.dispatch(GET_SUGGESTIONS, {currentLocation});
  }
};
