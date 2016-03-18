import * as actionTypes from "./actionTypes";

let cachedData;

export default {

  loadCategories(done) {
    if (cachedData) {
      this.dispatch(actionTypes.LOAD_CATEGORIES_SUCCESS, cachedData);
      done && done(null, cachedData);
      return;
    }

    this.dispatch(actionTypes.LOAD_CATEGORIES_START);
    this.flux.service
      .read("categories")
      .end((error, data) => {
        if (error) {
          this.dispatch(actionTypes.LOAD_CATEGORIES_FAILURE, { error });
          done && done(error);
          return;
        }
        this.dispatch(actionTypes.LOAD_CATEGORIES_SUCCESS, data);
        cachedData = data;
        done && done(null, data);
      });
  }

};
