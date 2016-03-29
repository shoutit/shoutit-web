import * as actionTypes from './actionTypes';

export default {

  loadListeners(user, done) {
    this.dispatch(actionTypes.LOAD_LISTENERS_START, { user });
    this.flux.service
      .read('listeners')
      .params({ user })
      .end((error, data) => {
        if (error) {
          this.dispatch(actionTypes.LOAD_LISTENERS_FAILURE, { error, user });
          done && done(error);
          return;
        }
        this.dispatch(actionTypes.LOAD_LISTENERS_SUCCESS, { ...data, user });
        done && done(null, data);
      });
  }

};
