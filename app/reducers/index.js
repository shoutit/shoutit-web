import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import * as actionTypes from  "../actions/actionTypes";

import entities from "./entities"; // manage entities coming from normalizr
import paginate from "./paginate"; // manage pagination

import session from "./session";
import miscReducer from "./misc";
import currentLocation from "./currentLocation";
import currentUrl from "./currentUrl";
import shuffledCategories from "./shuffledCategories";
import uiNotifications from "./uiNotifications";

const misc = combineReducers({
  categories: miscReducer({
    types: [
      actionTypes.LOAD_CATEGORIES_START,
      actionTypes.LOAD_CATEGORIES_SUCCESS,
      actionTypes.LOAD_CATEGORIES_FAILURE
    ]
  }),
  currencies: miscReducer({
    types: [
      actionTypes.LOAD_CURRENCIES_START,
      actionTypes.LOAD_CURRENCIES_SUCCESS,
      actionTypes.LOAD_CURRENCIES_FAILURE
    ]
  })
});

// Updates the pagination data for different actions.
const pagination = combineReducers({
  conversations: paginate({
    types: [
      actionTypes.LOAD_CONVERSATIONS_START,
      actionTypes.LOAD_CONVERSATIONS_SUCCESS,
      actionTypes.LOAD_CONVERSATIONS_FAILURE
    ]
  }),
  messages: paginate({
    types: [
      actionTypes.LOAD_MESSAGES_START,
      actionTypes.LOAD_MESSAGES_SUCCESS,
      actionTypes.LOAD_MESSAGES_FAILURE
    ]
  })
});

// Add `currentUrl` to the routing's state – useful for server-side rendering
const routing = (state, action) => {
  state = currentUrl(state, action);
  state = routerReducer(state, action);
  return state;
};

const rootReducer = combineReducers({
  session,
  currentLocation,
  misc,
  entities,
  pagination,
  shuffledCategories,
  uiNotifications,
  routing
});

export default rootReducer;
