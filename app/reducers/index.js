import { combineReducers } from "redux";
import { routerReducer as routing } from "react-router-redux";

import * as actionTypes from  "../actions/actionTypes";

import session from "./session";
import miscReducer from "./misc";
import currentLocation from "./currentLocation";
import entities from "./entities";
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

const rootReducer = combineReducers({
  session,
  currentLocation,
  misc,
  entities,
  shuffledCategories,
  uiNotifications,
  routing
});

export default rootReducer;
