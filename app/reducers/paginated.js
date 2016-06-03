import { combineReducers } from 'redux';

import chatConversations from './paginated/chatConversations';
import discoverItemsByCountry from './paginated/discoverItemsByCountry';
import listenersByTag from './paginated/listenersByTag';
import listenersByUser from './paginated/listenersByUser';
import listeningByUser from './paginated/listeningByUser';
import messagesByConversation from './paginated/messagesByConversation';
import notifications from './paginated/notifications';
import profilesBySearch from './paginated/profilesBySearch';
import relatedShoutsByShout from './paginated/relatedShoutsByShout';
import relatedTagsByTag from './paginated/relatedTagsByTag';
import shoutsByDiscoverItem from './paginated/shoutsByDiscoverItem';
import shoutsByHome from './paginated/shoutsByHome';
import shouts from './paginated/shouts';
import shoutsByTagname from './paginated/shoutsByTagname';
import shoutsByUsername from './paginated/shoutsByUsername';
import suggestions from './paginated/suggestions';
import tagsBySearch from './paginated/tagsBySearch';

export default combineReducers({
  chatConversations,
  discoverItemsByCountry,
  listenersByUser,
  listenersByTag,
  listeningByUser,
  messagesByConversation,
  notifications,
  profilesBySearch,
  relatedShoutsByShout,
  relatedTagsByTag,
  shoutsByDiscoverItem,
  shoutsByHome,
  shouts,
  shoutsByTagname,
  shoutsByUsername,
  suggestions,
  tagsBySearch,
});
