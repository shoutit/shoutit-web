import createEntityReducer from './createEntityReducer';

export default (state, action) => {
  state = createEntityReducer({ name: 'notifications' })(state, action);
  return state;
};
