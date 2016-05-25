import omit from 'lodash/omit';
import get from 'lodash/get';

import { denormalize } from '../schemas';

export function getLoggedUser(state) {
  return denormalize(state.entities.users[state.session.user], state.entities, 'PROFILE');
}

// Misc selector

export function getPaginationStatus(state, selector) {
  return omit(get(state.paginated, selector), 'ids');
}

// Shouts selectors

export function getShoutsByUsername(state, username) {
  const paginated = state.paginated.shoutsByUsername[username];
  if (!paginated) {
    return [];
  }
  return paginated.ids.map(id =>
    denormalize(state.entities.shouts[id], state.entities, 'SHOUT')
  );
}

export function getHomepageShouts(state) {
  return state.paginated.shoutsByHome.ids.map(
    id => denormalize(state.entities.shouts[id], state.entities, 'SHOUT')
  );
}
