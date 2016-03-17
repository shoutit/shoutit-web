import * as actionTypes from "./actionTypes";

let cachedData;

export default {

  loadCurrencies(done) {
    if (cachedData) {
      this.dispatch(actionTypes.LOAD_CURRENCIES_SUCCESS, cachedData);
      done && done(null, cachedData);
      return;
    }
    this.dispatch(actionTypes.LOAD_CURRENCIES_START);
    this.flux.service
      .read("currencies")
      .end((error, data) => {
        if (error) {
          this.dispatch(actionTypes.LOAD_CURRENCIES_FAILURE, { error });
          done && done(error);
          return;
        }
        this.dispatch(actionTypes.LOAD_CURRENCIES_SUCCESS, data);
        cachedData = data;
        done && done(null, data);
      });
  }

};
