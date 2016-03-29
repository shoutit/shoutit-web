import * as actionTypes from './actionTypes';

export default {

  loadListening(user, type, done) {
    this.dispatch(actionTypes.LOAD_LISTENING_START, { user });
    this.flux.service
      .read('listening')
      .params({ user, type })
      .end((error, data) => {
        if (error) {
          this.dispatch(actionTypes.LOAD_LISTENING_FAILURE, { error, user });
          done && done(error);
          return;
        }
        this.dispatch(actionTypes.LOAD_LISTENING_SUCCESS, { ...data, user });
        done && done(null, data);
      });
  }

};
