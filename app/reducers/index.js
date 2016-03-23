import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import categories from "./categories";
import currencies from "./currencies";
import currentLocation from "./currentLocation";
import currentUrl from "./currentUrl";
import entity from "./entity";
import forms from "./forms";
import paginate from "./paginate";
import session from "./session";
import uiNotifications from "./uiNotifications";

import * as actionTypes from "../actions/actionTypes";

// Add `currentUrl` to the routing's state – useful for server-side rendering
const routing = (state, action) => {
  state = currentUrl(state, action);
  state = routerReducer(state, action);
  return state;
};

const paginated = combineReducers({
  messagesByConversation: paginate({
    mapActionToKey: action => action.payload.conversationId,
    fetchTypes: [
      actionTypes.LOAD_MESSAGES_START,
      actionTypes.LOAD_MESSAGES_SUCCESS,
      actionTypes.LOAD_MESSAGES_FAILURE
    ],
    createTypes: [
      actionTypes.REPLY_CONVERSATION_START,
      actionTypes.REPLY_CONVERSATION_SUCCESS,
      actionTypes.REPLY_CONVERSATION_FAILURE
    ]
  }),
  chat: paginate({
    fetchTypes: [
      actionTypes.LOAD_MESSAGES_START,
      actionTypes.LOAD_MESSAGES_SUCCESS,
      actionTypes.LOAD_MESSAGES_FAILURE
    ]
  })
});

const entities = combineReducers({

  categories: entity({ name: "categories"}),
  conversations: entity({ name: "conversations"}),
  currencies: entity({ name: "currencies"}),

  messages: entity({
    name: "messages",
    createTypes: [
      actionTypes.REPLY_CONVERSATION_START,
      actionTypes.REPLY_CONVERSATION_SUCCESS,
      actionTypes.REPLY_CONVERSATION_FAILURE
    ]
  }),

  shouts: entity({ name: "shouts"}),
  tags: entity({ name: "tags"}),
  users: entity({ name: "users"})

});


const rootReducer = combineReducers({
  categories,
  currencies,
  currentLocation,
  entities,
  forms,
  paginated,
  routing,
  session,
  uiNotifications
});

export default rootReducer;
