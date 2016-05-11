import { combineReducers } from 'redux';

import chatConversations from './chatConversations';
import discoverItemsByCountry from './discoverItemsByCountry';
import listenersByUser from './listenersByUser';
import listenersByTag from './listenersByTag';
import listeningByUser from './listeningByUser';
import messagesByConversation from './messagesByConversation';
import profilesBySearch from './profilesBySearch';
import relatedShoutsByShout from './relatedShoutsByShout';
import relatedTagsByTag from './relatedTagsByTag';
import shoutsByDiscoverItem from './shoutsByDiscoverItem';
import shoutsByHome from './shoutsByHome';
import shoutsBySearch from './shoutsBySearch';
import shoutsByTagname from './shoutsByTagname';
import shoutsByUsername from './shoutsByUsername';
import suggestions from './suggestions-paginated';
import tagsBySearch from './tagsBySearch';

export default combineReducers({
  chatConversations,
  discoverItemsByCountry,
  listenersByUser,
  listenersByTag,
  listeningByUser,
  messagesByConversation,
  profilesBySearch,
  relatedShoutsByShout,
  relatedTagsByTag,
  shoutsByDiscoverItem,
  shoutsByHome,
  shoutsBySearch,
  shoutsByTagname,
  shoutsByUsername,
  suggestions,
  tagsBySearch,
});
