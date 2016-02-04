import consts from "./consts";

export default {
  loadPredictions(term) {
    this.dispatch(consts.LOAD_PREDICTIONS, {
      term
    });
  },

  selectLocation(prediction) {
    this.dispatch(consts.SELECT_LOCATION, {
      prediction
    });
  },

  updateLocationToFeed() {
    this.dispatch(consts.UPDATE_LOCATION_TO_FEED);
  },

  acquireLocation() {
    this.dispatch(consts.ACQUIRE_LOCATION);
  }
};
