import { combineReducers } from 'redux';
import stringify from 'json-stable-stringify';

import categories from './categories';
import chat from './chat';
import conversations from './entities-conversations';
import currencies from './currencies';
import currentLocation from './currentLocation';
import entity from './entity';
import forms from './forms';
import listenersByUser from './listenersByUser';
import listeningByUser from './listeningByUser';
import modals from './modals';
import paginate from './paginate';
import placePredictions from './placePredictions';
import routing from './routing';
import server from './server';
import session from './session';
import shoutsBySearch from './shoutsBySearch';
import suggestions from './suggestions';
import uiNotifications from './uiNotifications';
import videocalls from './videocalls';

import * as actionTypes from '../actions/actionTypes';

const paginated = combineReducers({
  messagesByConversation: paginate({
    mapActionToKey: action => action.payload.conversationId,
    mapActionToTempId: action => action.payload.message.id,
    fetchTypes: [
      actionTypes.LOAD_MESSAGES_START,
      actionTypes.LOAD_MESSAGES_SUCCESS,
      actionTypes.LOAD_MESSAGES_FAILURE,
    ],
    createTypes: [
      actionTypes.REPLY_CONVERSATION_START,
      actionTypes.REPLY_CONVERSATION_SUCCESS,
    ],
    addType: actionTypes.ADD_MESSAGE,
  }),
  chat: paginate({
    fetchTypes: [
      actionTypes.LOAD_CONVERSATIONS_START,
      actionTypes.LOAD_CONVERSATIONS_SUCCESS,
      actionTypes.LOAD_CONVERSATIONS_FAILURE,
    ],
    addType: actionTypes.LOAD_CONVERSATION_SUCCESS,
    deleteType: actionTypes.LEAVE_CONVERSATION_START,
  }),
  shoutsBySearch,
  tagsBySearch: paginate({
    mapActionToKey: action => stringify(action.payload.searchParams),
    fetchTypes: [
      actionTypes.SEARCH_TAGS_START,
      actionTypes.SEARCH_TAGS_SUCCESS,
      actionTypes.SEARCH_TAGS_FAILURE,
    ],
  }),
  profilesBySearch: paginate({
    mapActionToKey: action => stringify(action.payload.searchParams),
    fetchTypes: [
      actionTypes.SEARCH_PROFILES_START,
      actionTypes.SEARCH_PROFILES_SUCCESS,
      actionTypes.SEARCH_PROFILES_FAILURE,
    ],
  }),
  shoutsByHome: paginate({
    fetchTypes: [
      actionTypes.LOAD_HOME_SHOUTS_START,
      actionTypes.LOAD_HOME_SHOUTS_SUCCESS,
      actionTypes.LOAD_HOME_SHOUTS_FAILURE,
    ],
  }),
  shoutsByUsername: paginate({
    mapActionToKey: action => action.payload.username,
    fetchTypes: [
      actionTypes.LOAD_USER_SHOUTS_START,
      actionTypes.LOAD_USER_SHOUTS_SUCCESS,
      actionTypes.LOAD_USER_SHOUTS_FAILURE,
    ],
  }),
  listenersByUser,
  listeningByUser,
  discoverItemsByCountry: paginate({
    mapActionToKey: action => action.payload.country,
    fetchTypes: [
      actionTypes.LOAD_DISCOVER_ITEMS_START,
      actionTypes.LOAD_DISCOVER_ITEMS_SUCCESS,
      actionTypes.LOAD_DISCOVER_ITEMS_FAILURE,
    ],
  }),
  shoutsByDiscoverItem: paginate({
    mapActionToKey: action => action.payload.discoverItemId,
    fetchTypes: [
      actionTypes.LOAD_DISCOVER_SHOUTS_START,
      actionTypes.LOAD_DISCOVER_SHOUTS_SUCCESS,
      actionTypes.LOAD_DISCOVER_SHOUTS_FAILURE,
    ],
  }),
  suggestions: paginate({
    fetchTypes: [
      actionTypes.LOAD_SUGGESTIONS_START,
      actionTypes.LOAD_SUGGESTIONS_SUCCESS,
      actionTypes.LOAD_SUGGESTIONS_FAILURE,
    ],
  }),
});

const entities = combineReducers({

  categories: entity({ name: 'categories' }),

  conversations: (state, action) => {
    let newState = entity({ name: 'conversations' })(state, action);
    newState = conversations(newState, action);
    return newState;
  },

  currencies: entity({ name: 'currencies' }),

  messages: entity({
    name: 'messages',
    mapActionToTempId: action => action.payload.message.id,
    mapActionToTempEntity: action => action.payload.message,
    createTypes: [
      actionTypes.REPLY_CONVERSATION_START,
      actionTypes.REPLY_CONVERSATION_SUCCESS,
      actionTypes.REPLY_CONVERSATION_FAILURE,
    ],
  }),

  shouts: entity({ name: 'shouts' }),
  tags: entity({ name: 'tags' }),
  users: entity({ name: 'users' }),
  discoverItems: entity({ name: 'discoverItems' }),

});

const rootReducer = combineReducers({
  categories,
  chat,
  currencies,
  currentLocation,
  entities,
  forms,
  modals,
  paginated,
  placePredictions,
  routing,
  session,
  suggestions,
  uiNotifications,
  videocalls,
  server,
});

export default rootReducer;
