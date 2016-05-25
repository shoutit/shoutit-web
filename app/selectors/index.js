import { denormalize } from '../schemas';

export function getLoggedUser(state) {
  return denormalize(state.entities.users[state.session.user], state.entities, 'PROFILE');
}

export function getShoutsByUsername(state, username) {
  const paginated = state.paginated.shoutsByUsername[username];
  if (!paginated) {
    return [];
  }
  return paginated.ids.map(id =>
    denormalize(state.entities.shouts[id], state.entities, 'SHOUT')
  );
}
