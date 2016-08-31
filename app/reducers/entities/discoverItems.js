import createEntityReducer from './createEntityReducer';

export default createEntityReducer({ name: 'discoverItems' });

export function getDiscoverItem(state, id) {
  return state.entities.discoverItems[id];
}
