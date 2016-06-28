import { routerReducer } from 'react-router-redux';
import queryString from 'query-string';
import _omit from 'lodash/omit';

import * as actionTypes from '../actions/actionTypes';

const initialState = {
  currentUrl: undefined,
  error: null,
  query: null,
};

export function routing(state = initialState, action) {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
      // set the current url and reset the routing error if it changed
      const currentUrl = `${action.payload.pathname}${action.payload.search}`;
      const query = action.payload.query;
      return {
        ...state,
        query,
        currentUrl,
        error: state.currentUrl !== currentUrl ? null : state.error,
      };
    case actionTypes.ROUTE_ERROR:
      return {
        ...state,
        error: action.payload,
      };
  }
  return state;
}

// Add `currentUrl` to the routing's state – useful for server-side rendering
export default function (state, action) {
  let newState = routing(state, action);
  newState = routerReducer(newState, action);
  return newState;
}

export function getQueryAsString(state, omit = []) {
  return queryString.stringify(_omit(state.routing.query, omit));
}

export function getQuery(state) {
  return state.routing.query;
}
