import { closeModal } from '../actions/ui';

export default store => next => action => { // eslint-disable-line no-unused-vars
  if (action.type === '@@router/LOCATION_CHANGE') {
    store.dispatch(closeModal());
  }
  return next(action);

};
