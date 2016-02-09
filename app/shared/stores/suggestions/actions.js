import consts from "./consts";
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
        this.dispatch(consts.GET_SUGGESTIONS_FAIL, {currentLocation});
        debug(err);
      } else if(res.statusCode === 200) {
        this.dispatch(consts.GET_SUGGESTIONS_SUCCESS, {
          res: res.body,
          currentLocation
        });
      } else {
        this.dispatch(consts.GET_SUGGESTIONS_FAIL, {currentLocation});
        debug(res.body);
      }
    });

    this.dispatch(consts.GET_SUGGESTIONS, {currentLocation});
  }
};
