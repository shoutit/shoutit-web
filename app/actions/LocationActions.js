import * as actionTypes from "./actionTypes";

export default {

  getCurrentLocation(done) {
    this.dispatch(actionTypes.CURRENT_LOCATION_START);
    this.flux.service
      .read("geocode")
      .end((error, data) => {
        if (error) {
          this.dispatch(actionTypes.CURRENT_LOCATION_FAILURE, { error });
          done && done(error);
          return;
        }
        this.dispatch(actionTypes.CURRENT_LOCATION_SUCCESS, data);
        done && done(null, data);
      });
  }

};
