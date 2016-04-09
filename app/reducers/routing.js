import { routerReducer } from 'react-router-redux';

import * as actionTypes from '../actions/actionTypes';

const initialState = {
  currentUrl: undefined,
  error: null,
};

export function routing(state = initialState, action) {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
      // set the current url and reset the routing error if it changed
      const currentUrl = `${action.payload.pathname}${action.payload.search}`;
      return {
        ...state,
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
