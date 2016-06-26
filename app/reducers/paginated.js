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
import shoutsByTagname from './paginated/shoutsByTagname';
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
  shoutsByTagname,
  shoutsByUsername,
  suggestions,
  tagListeningByUser,
});

export function getState(state, selector) {
  return omit(get(state.paginated, selector), 'ids');
}
