import get from 'lodash/get';
import { combineReducers } from 'redux';

import conversations from './paginated/conversations';
import discoverItemsByCountry from './paginated/discoverItemsByCountry';
import listenersByTag from './paginated/listenersByTag';
import listenersByUser from './paginated/listenersByUser';
import listeningByUser from './paginated/listeningByUser';
import messagesByConversation from './paginated/messagesByConversation';
import notifications from './paginated/notifications';
import pagesByUsername from './paginated/pagesByUsername';
import publicChats from './paginated/publicChats';
import relatedShoutsByShout from './paginated/relatedShoutsByShout';
import relatedTagsByTag from './paginated/relatedTagsByTag';
import shouts from './paginated/shouts';
import shoutsByDiscoverItem from './paginated/shoutsByDiscoverItem';
import shoutsByHome from './paginated/shoutsByHome';
import shoutsByTagSlug from './paginated/shoutsByTagSlug';
import shoutsByUsername from './paginated/shoutsByUsername';
import suggestions from './paginated/suggestions';
import tagListeningByUser from './paginated/tagListeningByUser';

export default combineReducers({
  conversations,
  discoverItemsByCountry,
  listenersByTag,
  listenersByUser,
  listeningByUser,
  messagesByConversation,
  notifications,
  pagesByUsername,
  publicChats,
  relatedShoutsByShout,
  relatedTagsByTag,
  shouts,
  shoutsByDiscoverItem,
  shoutsByHome,
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
  return paginationState;
}
