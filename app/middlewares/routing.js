import { replace } from 'react-router-redux';
import { closeModal } from '../actions/ui';
import * as actionTypes from '../actions/actionTypes';

export default store => next => action => { // eslint-disable-line no-unused-vars
  const state = store.getState();

  switch (action.type) {
    case actionTypes.LEAVE_CONVERSATION_START:
      const { id } = action.payload;
      if (state.routing.currentUrl === `/messages/${id}`) {
        store.dispatch(replace('/messages'));
      }
      break;
    default:

  }
  return next(action);

};
