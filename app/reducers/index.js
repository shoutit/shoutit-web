import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import stringify from 'json-stable-stringify';

import categories from './categories';
import currencies from './currencies';
import chat from './chat';
import conversations from './entities-conversations';
import currentLocation from './currentLocation';
import currentUrl from './currentUrl';
import entity from './entity';
import forms from './forms';
import paginate from './paginate';
import session from './session';
import placePredictions from './placePredictions';
import videocalls from './videocalls';
import uiNotifications from './uiNotifications';
import modals from './modals';

import * as actionTypes from '../actions/actionTypes';

// Add `currentUrl` to the routing's state – useful for server-side rendering
const routing = (state, action) => {
  let newState = currentUrl(state, action);
  newState = routerReducer(newState, action);
  return newState;
};

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
  shoutsBySearch: paginate({
    mapActionToKey: action => stringify(action.payload.searchParams),
    fetchTypes: [
      actionTypes.SEARCH_SHOUTS_START,
      actionTypes.SEARCH_SHOUTS_SUCCESS,
      actionTypes.SEARCH_SHOUTS_FAILURE,
    ],
  }),
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
  uiNotifications,
  videocalls,
});

export default rootReducer;
