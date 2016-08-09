import omit from 'lodash/omit';
import get from 'lodash/get';
import { combineReducers } from 'redux';

import chatConversations from './paginated/chatConversations';
import discoverItemsByCountry from './paginated/discoverItemsByCountry';
import listenersByTag from './paginated/listenersByTag';
import listenersByUser from './paginated/listenersByUser';
import listeningByUser from './paginated/listeningByUser';
import messagesByConversation from './paginated/messagesByConversation';
import notifications from './paginated/notifications';
import relatedShoutsByShout from './paginated/relatedShoutsByShout';
import relatedTagsByTag from './paginated/relatedTagsByTag';
import shoutsByDiscoverItem from './paginated/shoutsByDiscoverItem';
import shoutsByHome from './paginated/shoutsByHome';
import shouts from './paginated/shouts';
import shoutsByTagSlug from './paginated/shoutsByTagSlug';
import shoutsByUsername from './paginated/shoutsByUsername';
import suggestions from './paginated/suggestions';
import tagListeningByUser from './paginated/tagListeningByUser';

export default combineReducers({
  chatConversations,
  discoverItemsByCountry,
  listenersByUser,
  listenersByTag,
  listeningByUser,
  messagesByConversation,
  notifications,
  relatedShoutsByShout,
  relatedTagsByTag,
  shoutsByDiscoverItem,
  shoutsByHome,
  shouts,
  shoutsByTagSlug,
  shoutsByUsername,
  suggestions,
  tagListeningByUser,
});

/**
 * Returns an object containing the pagination state for the specified path.
 * {
 *   isFetching // boolean
 *   count // number
 *   nextUrl // string
 *   prevUrl // string
 *   error // object
 * }
 *
 * @export
 * @param {any} state The store state
 * @param {Array|String} path The path of the paginated reducer
 * @returns {Object}
 */
export function getPagination(state, path) {
  const paginationState = get(state.paginated, path);
  if (!paginationState) {
    return {
      isFetching: false,
      count: 0,
    };
  }
  return omit(paginationState, 'ids');
}
