import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import * as actionTypes from  "../actions/actionTypes";

// import entities from "./entities"; // manage entities coming from normalizr
import paginate from "./paginate"; // manage pagination

import session from "./session";
import currentLocation from "./currentLocation";
import chat from "./chat";
import entities from "./entities";
import messagesByConversation from "./messagesByConversation";
import categories from "./categories";
import currencies from "./currencies";
import currentUrl from "./currentUrl";
import uiNotifications from "./uiNotifications";


// Updates the pagination data for different actions.
// const pagination = combineReducers({
//   conversations: paginate({
//     types: [
//       actionTypes.LOAD_CONVERSATIONS_START,
//       actionTypes.LOAD_CONVERSATIONS_SUCCESS,
//       actionTypes.LOAD_CONVERSATIONS_FAILURE
//     ]
//   }),
//   messages: paginate({
//     types: [
//       actionTypes.LOAD_MESSAGES_START,
//       actionTypes.LOAD_MESSAGES_SUCCESS,
//       actionTypes.LOAD_MESSAGES_FAILURE
//     ]
//   })
// });

// Add `currentUrl` to the routing's state – useful for server-side rendering
const routing = (state, action) => {
  state = currentUrl(state, action);
  state = routerReducer(state, action);
  return state;
};

const rootReducer = combineReducers({
  categories,
  chat,
  messagesByConversation,
  currencies,
  currentLocation,
  entities,
  routing,
  session,
  uiNotifications
});

export default rootReducer;
