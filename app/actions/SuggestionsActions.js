import * as actionTypes from "./actionTypes";

export default {

  loadSuggestions(location, type="users,pages,tags,shouts,shout", done) {
    this.dispatch(actionTypes.LOAD_SUGGESTIONS_START, { location });
    this.flux.service
      .read("suggestions")
      .params({ type })
      .end((error, suggestions) => {
        if (error) {
          this.dispatch(actionTypes.LOAD_SUGGESTIONS_FAILURE, { error, location });
          done && done(error);
          return;
        }
        this.dispatch(actionTypes.LOAD_SUGGESTIONS_SUCCESS, { suggestions, location });
        done && done(null, suggestions);
      });
  }

};
